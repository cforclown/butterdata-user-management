import { Types } from 'mongoose';
import { IRole, IStudent, IUser } from '../resources';

export const adminRole: IRole = {
  _id: (new Types.ObjectId()).toString(),
  name: 'Admin',
  permissions: {
    dashboard: {
      view: true,
      create: true,
      update: true,
      delete: true
    },
    tabloTahunan: {
      view: true,
      create: true,
      update: true,
      delete: true,
      setEksekusi: true,
      updateEksekusi: true,
      deleteEksekusi: true,
      checkEksekusi: true,
      report: true
    },
    ketersediaanBarang: {
      view: true,
      create: true,
      update: true,
      delete: true,
      insertItem: true,
      updateItem: true,
      deleteItem: true,
      report: true
    },
    dataGangguan: {
      view: true,
      update: true
    },
    workOrder: {
      view: true,
      update: true
    },
    temuanSri: {
      view: true,
      update: true
    },
    dataTrip: {
      view: true,
      update: true
    },
    programKerja: {
      view: true,
      update: true
    },
    strukturOrganisasi: {
      view: true,
      update: true
    },
    workshop: {
      view: true,
      create: true,
      update: true,
      delete: true
    },
    stokMaterial: {
      view: true,
      update: true
    },
    garduTraksi: {
      view: true,
      update: true
    },
    resors: {
      view: true,
      create: true,
      update: true,
      delete: true
    },
    users: {
      view: true,
      create: true,
      update: true,
      delete: true
    },
    masterData: {
      view: true,
      create: true,
      update: true,
      delete: true
    },
    staticAttribute: {
      view: true,
      create: true,
      update: true,
      delete: true
    }
  },
  desc: 'Admin role. Allowed to view, create, modify and delete data. Default. This role cannot be deleted',
  default: true,
  editable: false
};

export const dummyResor: IStudent = {
  _id: (new Types.ObjectId()).toString(),
  nomor: 'xxx',
  name: 'dummy-resor',
  kode: 'xxx'
};

export const admin: IUser = {
  _id: (new Types.ObjectId()).toString(),
  username: 'admin',
  password: '99adc231b045331e514a516b4b7680f588e3823213abe901738bc3ad67b2f6fcb3c64efb93d18002588d3ccc1a49efbae1ce20cb43df36b38651f11fa75678e8', // root
  fullname: 'Admin',
  nipp: 'admin',
  resor: dummyResor,
  role: adminRole._id
};
