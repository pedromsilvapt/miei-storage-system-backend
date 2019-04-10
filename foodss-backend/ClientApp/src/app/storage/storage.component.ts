import {Component, OnInit} from '@angular/core';
import {StorageModel} from './model/storage.model';
import * as _ from 'lodash';
import {Product} from '../product/model/product.model';

@Component({
  selector: 'app-storage',
  templateUrl: './storage.component.html',
  styleUrls: ['./storage.component.scss']
})
export class StorageComponent implements OnInit {

  // TODO variable below should be of type StorageModel
  public storages: Array<StorageModel> = [
    {
      id: 1,
      name: 'Despensa 01',
      isShared: false,
      userOwner: {
        id: 1,
        name: 'José'
      },
      products: [
        {
          id: 1,
          name: 'Arroz',
          amount: 1,
          barCode: '10001',
          hasExpireDate: true,
          userOwner: {
            id: 1,
            name: 'José'
          },
          isShared: false,
          expireDate: new Date('2019-04-11'),
          addedDate: new Date('2019-03-10'),
          consumedDate: null
        },
        {
          id: 2,
          name: 'Café',
          amount: 2,
          barCode: '10002',
          hasExpireDate: true,
          userOwner: {
            id: 1,
            name: 'José'
          },
          isShared: false,
          expireDate: new Date('2019-04-12'),
          addedDate: new Date('2019-03-10'),
          consumedDate: null
        },
        {
          id: 3,
          name: 'Bolacha',
          amount: 3,
          barCode: '10003',
          hasExpireDate: true,
          userOwner: {
            id: 1,
            name: 'José'
          },
          isShared: false,
          expireDate: new Date('2019-04-13'),
          addedDate: new Date('2019-03-10'),
          consumedDate: null
        },
        {
          id: 4,
          name: 'Leite',
          amount: 4,
          barCode: '10004',
          hasExpireDate: true,
          userOwner: {
            id: 1,
            name: 'José'
          },
          isShared: false,
          expireDate: new Date('2019-04-14'),
          addedDate: new Date('2019-03-10'),
          consumedDate: null
        },
        {
          id: 5,
          name: 'Ovos',
          amount: 5,
          barCode: '10005',
          hasExpireDate: true,
          userOwner: {
            id: 1,
            name: 'José'
          },
          isShared: false,
          expireDate: new Date('2019-04-15'),
          addedDate: new Date('2019-03-10'),
          consumedDate: null
        },
        {
          id: 6,
          name: 'Carne',
          amount: 6,
          barCode: '10006',
          hasExpireDate: true,
          userOwner: {
            id: 1,
            name: 'José'
          },
          isShared: false,
          expireDate: new Date('2019-04-16'),
          addedDate: new Date('2019-03-10'),
          consumedDate: null
        }
      ]
    },
    {
      id: 2,
      name: 'Despensa 02',
      isShared: false,
      userOwner: {
        id: 1,
        name: 'José'
      },
      products: [
        {
          id: 7,
          name: 'Uva',
          amount: 1,
          barCode: '10007',
          hasExpireDate: true,
          userOwner: {
            id: 1,
            name: 'José'
          },
          isShared: false,
          expireDate: new Date('2019-04-11'),
          addedDate: new Date('2019-03-10'),
          consumedDate: null
        },
        {
          id: 8,
          name: 'Laranja',
          amount: 2,
          barCode: '10008',
          hasExpireDate: true,
          userOwner: {
            id: 1,
            name: 'José'
          },
          isShared: false,
          expireDate: new Date('2019-04-12'),
          addedDate: new Date('2019-03-10'),
          consumedDate: null
        },
        {
          id: 9,
          name: 'Maçã',
          amount: 3,
          barCode: '10009',
          hasExpireDate: true,
          userOwner: {
            id: 1,
            name: 'José'
          },
          isShared: false,
          expireDate: new Date('2019-04-13'),
          addedDate: new Date('2019-03-10'),
          consumedDate: null
        },
        {
          id: 10,
          name: 'Limão',
          amount: 4,
          barCode: '10010',
          hasExpireDate: true,
          userOwner: {
            id: 1,
            name: 'José'
          },
          isShared: false,
          expireDate: new Date('2019-04-14'),
          addedDate: new Date('2019-03-10'),
          consumedDate: null
        },
        {
          id: 11,
          name: 'Abacaxi',
          amount: 5,
          barCode: '10011',
          hasExpireDate: true,
          userOwner: {
            id: 1,
            name: 'José'
          },
          isShared: false,
          expireDate: new Date('2019-04-15'),
          addedDate: new Date('2019-03-10'),
          consumedDate: null
        },
        {
          id: 12,
          name: 'Morango',
          amount: 6,
          barCode: '10012',
          hasExpireDate: true,
          userOwner: {
            id: 1,
            name: 'José'
          },
          isShared: false,
          expireDate: new Date('2019-04-16'),
          addedDate: new Date('2019-03-10'),
          consumedDate: null
        }
      ]
    },
    {
      id: 3,
      name: 'Despensa 03',
      isShared: true,
      userOwner: {
        id: 1,
        name: 'José'
      },
      products: [
        {
          id: 13,
          name: 'Macarrão',
          amount: 1,
          barCode: '10013',
          hasExpireDate: true,
          userOwner: {
            id: 1,
            name: 'José'
          },
          isShared: false,
          expireDate: new Date('2019-04-11'),
          addedDate: new Date('2019-03-10'),
          consumedDate: null
        },
        {
          id: 14,
          name: 'Açúcar',
          amount: 2,
          barCode: '10014',
          hasExpireDate: true,
          userOwner: {
            id: 2,
            name: 'Felipe'
          },
          isShared: true,
          expireDate: new Date('2019-04-12'),
          addedDate: new Date('2019-03-10'),
          consumedDate: null
        },
        {
          id: 15,
          name: 'Sal',
          amount: 3,
          barCode: '10015',
          hasExpireDate: true,
          userOwner: {
            id: 4,
            name: 'Renato'
          },
          isShared: false,
          expireDate: new Date('2019-04-13'),
          addedDate: new Date('2019-03-10'),
          consumedDate: null
        },
        {
          id: 16,
          name: 'Nata',
          amount: 4,
          barCode: '10016',
          hasExpireDate: true,
          userOwner: {
            id: 1,
            name: 'José'
          },
          isShared: false,
          expireDate: new Date('2019-04-14'),
          addedDate: new Date('2019-03-10'),
          consumedDate: null
        },
        {
          id: 17,
          name: 'Água',
          amount: 5,
          barCode: '10017',
          hasExpireDate: true,
          userOwner: {
            id: 2,
            name: 'Felipe'
          },
          isShared: true,
          expireDate: new Date('2019-04-15'),
          addedDate: new Date('2019-03-10'),
          consumedDate: null
        },
        {
          id: 18,
          name: 'Pão',
          amount: 6,
          barCode: '10012',
          hasExpireDate: true,
          userOwner: {
            id: 4,
            name: 'Renato'
          },
          isShared: false,
          expireDate: new Date('2019-04-18'),
          addedDate: new Date('2019-03-10'),
          consumedDate: null
        }
      ]
    },
  ];

  constructor() { }

  ngOnInit() {
  }

  public getSharedStoragePeople(storage: StorageModel): Array<string> {
    return Object.keys(this.groupSharedStorageProductsByUsers(storage));
  }

  public groupSharedStorageProductsByUsers(storage: StorageModel): any {
    return _.groupBy(storage.products, 'userOwner.name');
  }

}
