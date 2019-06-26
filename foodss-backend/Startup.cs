using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SpaServices.AngularCli;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using StorageSystem.Architecture.Exception;
using StorageSystem.Services;
using System.Net;

namespace StorageSystem
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_2);

            // Database Configuration
            var section = this.Configuration.GetSection("Database");
            var connection = $"server={section.GetValue<string>("Host")};database={section.GetValue<string>("Name")};user={section.GetValue<string>("User")};password={section.GetValue<string>("Pass")}";
            services.AddDbContextPool<Models.StorageSystemContext>(options => options.UseMySql(connection));

            // In production, the Angular files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/dist";
            });

            var key = System.Text.Encoding.ASCII.GetBytes(Configuration.GetValue<string>("Security:JwtSecret"));
            services.AddAuthentication(x =>
            {
                x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(x =>
            {
                x.RequireHttpsMetadata = false;
                x.SaveToken = true;
                x.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters()
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false
                };
                x.Events = new JwtBearerEvents();
                x.Events.OnChallenge = context =>
                {
                    // Skip the default logic.
                    context.HandleResponse();

                    var ex = new UnauthorizedException("UNAUTHORIZED");

                    var message = new { code = ex.StatusCode, error = ex.Message };

                    var result = JsonConvert.SerializeObject(message);
                    context.Response.StatusCode = message.code;
                    context.Response.ContentType = "application/json";
                    return context.Response.WriteAsync(result);
                };
            });

            services.AddSingleton<EmailService>();
            services.AddScoped<UserService>();
            services.AddScoped<StorageService>();
            services.AddScoped<StorageInvitationService>();
            services.AddScoped<StorageProductService>();
            services.AddScoped<StorageProductItemService>();
            services.AddScoped<StorageConsumedProductItemService>();
            services.AddScoped<ShoppingListService>();
            services.AddScoped<CityService>();
            services.AddScoped<WeatherService>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            app.UseForwardedHeaders(new ForwardedHeadersOptions {
                ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedHost  | ForwardedHeaders.XForwardedProto
            });
            app.UseAuthentication();
            app.UseExceptionHandler(a => a.Run(async context =>
            {
                var feature = context.Features.Get<IExceptionHandlerPathFeature>();
                var exception = feature.Error;

                object message;

                var apiException = exception as Architecture.Exception.ApiException;

                if (apiException != null)
                {
                    context.Response.StatusCode = apiException.StatusCode;

                    message = new { code = apiException.StatusCode, error = apiException.Message };
                }
                else
                {
                    context.Response.StatusCode = 500;

                    message = new { code = 500, error = exception.Message, stack = env.IsDevelopment() ? exception.StackTrace : null };
                }

                var result = JsonConvert.SerializeObject(message);
                context.Response.ContentType = "application/json";
                await context.Response.WriteAsync(result);
            }));

            app.UseStaticFiles();
            app.UseSpaStaticFiles();

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller}/{action=Index}/{id?}");
            });

            app.UseSpa(spa =>
            {
                // To learn more about options for serving an Angular SPA from ASP.NET Core,
                // see https://go.microsoft.com/fwlink/?linkid=864501

                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    // a) This version is slower when launching the server
                    // Because it restarts the angular compilation process every time
                    // However it is simpler since it does not require running the command manually
                    //spa.UseAngularCliServer(npmScript: "start");

                    // b) This significantly improves the start speed of the server
                    // But requires running the command 'npm start' on the ClientApp/ folder
                    // manually and leaving that command running
                    spa.UseProxyToSpaDevelopmentServer("http://localhost:4200");
                }
            });
        }
    }
}
