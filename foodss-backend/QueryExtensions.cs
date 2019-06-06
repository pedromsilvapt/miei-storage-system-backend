using Microsoft.EntityFrameworkCore.Internal;
using Microsoft.EntityFrameworkCore.Query;
using Microsoft.EntityFrameworkCore.Query.Internal;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using System.Linq.Expressions;

// Downloaded from
// https://github.com/aspnet/EntityFrameworkCore/issues/6482#issuecomment-399061388
namespace StorageSystem
{
    public static class IQueryableHelper
    {
        private static readonly FieldInfo _queryCompilerField = typeof(EntityQueryProvider).GetTypeInfo().DeclaredFields.Single(x => x.Name == "_queryCompiler");

        private static readonly TypeInfo _queryCompilerTypeInfo = typeof(QueryCompiler).GetTypeInfo();

        private static readonly FieldInfo _queryModelGeneratorField = _queryCompilerTypeInfo.DeclaredFields.Single(x => x.Name == "_queryModelGenerator");

        private static readonly FieldInfo _databaseField = _queryCompilerTypeInfo.DeclaredFields.Single(x => x.Name == "_database");

        private static readonly PropertyInfo _dependenciesProperty = typeof(Database).GetTypeInfo().DeclaredProperties.Single(x => x.Name == "Dependencies");

        public static string ToSql<TEntity>(this IQueryable<TEntity> queryable)
            where TEntity : class
        {
            if (!(queryable is EntityQueryable<TEntity>) && !(queryable is InternalDbSet<TEntity>))
                throw new ArgumentException();

            var queryCompiler = (IQueryCompiler)_queryCompilerField.GetValue(queryable.Provider);
            var queryModelGenerator = (IQueryModelGenerator)_queryModelGeneratorField.GetValue(queryCompiler);
            var queryModel = queryModelGenerator.ParseQuery(queryable.Expression);
            var database = _databaseField.GetValue(queryCompiler);
            var queryCompilationContextFactory = ((DatabaseDependencies)_dependenciesProperty.GetValue(database)).QueryCompilationContextFactory;
            var queryCompilationContext = queryCompilationContextFactory.Create(false);
            var modelVisitor = (RelationalQueryModelVisitor)queryCompilationContext.CreateQueryModelVisitor();
            modelVisitor.CreateQueryExecutor<TEntity>(queryModel);
            return modelVisitor.Queries.Join(Environment.NewLine + Environment.NewLine);
        }

        //
        // Summary:
        //     Specifies related entities to include in the query results. The navigation property
        //     to be included is specified starting with the type of entity being queried (TEntity).
        //     If you wish to include additional types based on the navigation properties of
        //     the type being included, then chain a call to Microsoft.EntityFrameworkCore.EntityFrameworkQueryableExtensions.ThenInclude``3(Microsoft.EntityFrameworkCore.Query.IIncludableQueryable{``0,System.Collections.Generic.IEnumerable{``1}},System.Linq.Expressions.Expression{System.Func{``1,``2}})
        //     after this call.
        //
        // Parameters:
        //   source:
        //     The source query.
        //
        //   navigationPropertyPath:
        //     A lambda expression representing the navigation property to be included (t =>
        //     t.Property1).
        //
        // Type parameters:
        //   TEntity:
        //     The type of entity being queried.
        //
        //   TProperty:
        //     The type of the related entity to be included.
        //
        // Returns:
        //     A new query with the related data included.
        //public static IIncludableQueryable<TEntity, TProperty> Include<TEntity, TProperty>([NotNullAttribute] this IQueryable<TEntity> source, [NotNullAttribute] Expression<Func<TEntity, TProperty>> navigationPropertyPath) where TEntity : class;
        public static IQueryable<TEntity> ConditionalInclude<TEntity, TProperty>(this IQueryable<TEntity> source, Expression<Func<TEntity, TProperty>> navigationPropertyPath, bool include) where TEntity : class
        {

            if (include)
            {
                return source.Include(navigationPropertyPath);
            }

            return source;
        }
    }
}