import { action, makeAutoObservable, observable } from 'mobx';
import { CloudDiskType } from './CloudSeaDisk';
import { Api, ApiResult } from '../../../common/api';

export type ResourcesType = {
  businessId?: string;
  current: number;
  direction?: string;
  directionDefault?: string;
  name?: string;
  isPublic?: boolean;
  pageSize?: number;
  parentId?: string;
  sort?: string;
  sortDefault?: string;
  isAdd?: boolean;
};

export type AllResourcesType = {
  content: AllResourcesList[];
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  pageable: { offset: string; pageNumber: number; pageSize: number; paged: boolean; sort: any[]; unpaged: boolean };
  size: number;
  sort: { empty: boolean; sorted: boolean; unsorted: boolean };
  totalElements: string;
  totalPages: number;
};

export type AllResourcesList = {
  createdTime?: Date;
  createdBy?: string;
  fileSize?: string;
  hits?: string;
  id: string;
  isPublic?: boolean;
  name: string;
  ossFileName?: string;
  parentId?: string;
  transCode?: string;
  type: number;
  updatedBy?: string;
  useCount?: number;
  userId?: string;
  weight?: number;
};

export type AllResourcesAllListType = {
  name: string;
  id: string;
  list: AllResourcesList[];
};

export type CreateNewFolderType = {
  isFolder?: boolean;
  name?: string;
  ossFileName?: string;
  parentId?: string;
};

export type DeleteOneFolderType = {
  id: string;
};

export type DeleteMoreFolderType = {
  ids: string[];
};

export type EditFolderNameType = {
  id: string;
  name: string;
};

export type SettingMorePublicFolderType = {
  ids: string[];
  isPublic: false;
};

export type MoveOneFolderType = {
  id: string;
  parentId: string;
};

export type MoveMoreFolderType = {
  ids: string[];
  parentId: string;
};

export type ResultCountType = { failCount: number; successCount: number; userId: string };

export const BaseUrl = '/resource';

export class CloudSeaDiskStore {
  constructor() {
    makeAutoObservable(this);
  }

  @observable cloudDisk: Array<CloudDiskType> = [
    { id: '12345', name: 'video-5', type: 1, url: 'http://192.168.0.100:50170/resources/202103/ss.m4a', size: '23.4mb' },
    { id: '12346', name: 'audio-6', type: 2, url: 'http://192.168.0.100:50170/resources/202103/1615275403225.mp3', size: '3.4mb' },
    { id: '12347', name: 'video-7', type: 1, url: 'http://192.168.0.100:50170/resources/202103/ss.m4a', size: '28.4mb' },
    { id: '12348', name: '我收藏的文件', type: 4 },
    { id: '12349', name: 'pptx-8', type: 3, url: 'http://192.168.0.100:50170/resources/202103/demo.pptx', size: '3.4mb' },
    { id: '12350', name: 'video-9', type: 1, url: 'http://192.168.0.100:50170/resources/202103/ss.m4a', size: '28.4mb' }
  ];

  @observable allResourcesAllList: AllResourcesAllListType[] = [];
  @observable allResourcesList: AllResourcesList[] = [];
  @observable allResourcesInfo: AllResourcesType | undefined;

  @observable selects: Array<string> = [];

  @observable parentId?: string = '0';

  @observable demandName?: string = '';
  @observable types?: string[] = [];
  @observable selectSessionIndex?: number = 0;
  @observable isEditVoidInfo: boolean = false;
  @observable isEditPage?: boolean = false;
  @observable isPublic: boolean = false;
  @observable orderList: OrderListType[] = [
    { name: 'createdTime', title: '创建时间' },
    { name: 'fileSize', title: '文件大小' },
    { name: 'useCount', title: '使用数量' },
    { name: 'name', title: '文件名' }
  ];
  @observable isOrder: number = 0;

  @observable screenName: string | undefined;
  @observable classSelectInfo?: ClassSelectInfoType;

  public getCurrent = (current: number) => {
    console.log(current);
    if (current === 0) {
      return 1;
    } else {
      console.log('%', current % 10, this.allResourcesList.length / 10);
      if (current % 10 === 0) {
        return current / 10 + 1;
      } else if (current % 10 < 10) {
        return Math.ceil(this.allResourcesList.length / 10);
      }
    }
  };

  /**
   * 获取私有和公有的所有文件
   * url: /oss-file/current-user or /oss-file/business-public
   */
  @action
  async accessToPublicResources(param: ResourcesType): Promise<boolean | string> {
    let isOrderParam = this.orderList[this.isOrder].name;
    let isPublicUrl = this.isPublic ? '/business-public' : '/current-user';
    const params = {
      current: param.current,
      isPublic: param.isPublic,
      parentId: param.parentId,
      direction: 'descend',
      pageSize: 10,
      sort: isOrderParam
    };
    console.log(params);
    const res: ApiResult = await Api.getInstance.get({ url: BaseUrl + '/oss-file' + isPublicUrl, params, withToken: true });
    if (res.success) {
      this.allResourcesList = await res.result.content;
      this.allResourcesInfo = await res.result;
      return Promise.resolve(res.success);
    } else {
      return Promise.resolve(res.message);
    }
  }

  /**
   * 获取私有和公有的所有文件  携带添加新数据操作
   * url: /oss-file/current-user or /oss-file/business-public
   */
  @action
  async addAccessToPublicResources(param: ResourcesType): Promise<boolean | string> {
    console.log(param, 'param--isAdd');
    let isOrderParam = this.orderList[this.isOrder].name;
    let isPublicUrl = this.isPublic ? '/business-public' : '/current-user';
    const params = {
      current: this.getCurrent(param.current),
      isPublic: param.isPublic,
      parentId: param.parentId,
      direction: param.direction,
      pageSize: 10,
      sort: isOrderParam
    };
    const res: ApiResult = await Api.getInstance.get({ url: BaseUrl + '/oss-file' + isPublicUrl, params, withToken: true });
    if (res.success) {
      console.log(param.current);
      if (param.current === 0) {
        this.allResourcesList = await res.result.content;
        this.allResourcesInfo = await res.result;
      } else {
        if (param.current % 10 === 0) {
          this.allResourcesList = this.allResourcesList.concat(res.result.content);
        } else if (param.current % 10 < 10) {
          console.log('上传完成');
        }
      }
      return Promise.resolve(res.success);
    } else {
      return Promise.resolve(res.message);
    }
  }

  /**
   * 创建文件夹或者文件
   * url: /oss-file
   */
  async createNewFolder(param: CreateNewFolderType): Promise<boolean | string> {
    const params = {
      isFolder: param.isFolder,
      name: param.name,
      ossFileName: param.ossFileName,
      parentId: param.parentId ? param.parentId : '0'
    };
    const res: ApiResult = await Api.getInstance.post({ url: BaseUrl + '/oss-file', params, withToken: true });
    if (res.success) {
      return Promise.resolve(res.success);
    } else {
      return Promise.resolve(res.message);
    }
  }

  /**
   * 删除单个文件或者文件夹
   * url: /oss-file/${id}
   */
  async deleteOneFolder(param: DeleteOneFolderType): Promise<boolean | string> {
    const res: ApiResult = await Api.getInstance.delete({ url: BaseUrl + `/oss-file/${param.id}`, withToken: true });
    if (res.success) {
      return Promise.resolve(res.success);
    } else {
      return Promise.resolve(res.message);
    }
  }

  /**
   * 删除多个文件或者文件夹
   * url: /oss-file/batch-delete
   */
  async deleteMoreFolder(param: DeleteMoreFolderType): Promise<boolean | string> {
    const params = {
      ids: param.ids
    };
    console.log(param);
    const res: ApiResult = await Api.getInstance.post({ url: BaseUrl + '/oss-file/batch-delete', params, withToken: true });
    if (res.success) {
      return Promise.resolve(res.success);
    } else {
      return Promise.resolve(res.message);
    }
  }

  /**
   * 文件重命名
   * url: /oss-file/${id}
   */
  async editFolderName(param: EditFolderNameType): Promise<boolean | string> {
    const params = {
      name: param.name
    };
    console.log(param);
    const res: ApiResult = await Api.getInstance.patch({ url: BaseUrl + `/oss-file/${param.id}`, params, withToken: true });
    if (res.success) {
      console.log('[log]');
      console.log(res);
      console.log('[log]');
      return Promise.resolve(res.success);
    } else {
      return Promise.resolve(res.message);
    }
  }

  /**
   * 批量转换文件公私属性
   * url: /oss-file/batch-convert
   */
  async settingMorePublicFolder(param: SettingMorePublicFolderType): Promise<boolean | string> {
    const params = {
      ids: param.ids,
      isPublic: param.isPublic
    };
    const res: ApiResult = await Api.getInstance.post({ url: BaseUrl + `/oss-file/batch-convert`, params, withToken: true });
    if (res.success) {
      console.log('[log]');
      console.log(res);
      console.log('[log]');
      return Promise.resolve(res.success);
    } else {
      return Promise.resolve(res.message);
    }
  }

  /**
   * 转换单个文件公私属性
   * url: /oss-file/batch-convert
   */
  async settingOneFolder(param: SettingMorePublicFolderType): Promise<boolean | string> {
    const params = {
      id: param.ids[0],
      isPublic: param.isPublic
    };
    const res: ApiResult = await Api.getInstance.patch({ url: BaseUrl + `/oss-file/convert`, params, withToken: true });
    if (res.success) {
      console.log('[log]');
      console.log(res);
      console.log('[log]');
      return Promise.resolve(res.success);
    } else {
      return Promise.resolve(res.message);
    }
  }

  /**
   * 移动单个文件
   * url: /oss-file/batch-convert
   */
  async moveOneFolder(param: MoveOneFolderType): Promise<boolean | string> {
    const params = {
      id: param.id,
      parentId: param.parentId
    };
    const res: ApiResult = await Api.getInstance.patch({ url: BaseUrl + '/oss-file/move', params, withToken: true });
    if (res.success) {
      console.log('[log]');
      console.log(res);
      console.log('[log]');
      return Promise.resolve(res.success);
    } else {
      return Promise.resolve(res.message);
    }
  }

  /**
   * 移动多个文件
   * url: /oss-file/batch-move
   */
  async moveMoreFolder(param: MoveMoreFolderType): Promise<ResultCountType | string> {
    const params = {
      ids: param.ids,
      parentId: param.parentId
    };
    const res: ApiResult = await Api.getInstance.post({ url: BaseUrl + '/oss-file/batch-move', params, withToken: true });
    if (res.success) {
      console.log('[log]');
      console.log(res);
      console.log('[log]');
      return Promise.resolve(res.result);
    } else {
      return Promise.resolve(res.message);
    }
  }
}

export type OrderListType = {
  name: string;
  title: string;
};

export enum FileType {
  FOLDER = 0, //, "文件夹"),
  PICTURE = 1, //, "图片"),
  AUDIO = 2, //, "音频"),
  VIDEO = 3, //, "视频"),
  PDF = 4, //, "pdf文档"),
  WORD = 5, //, "word文档"),
  EXCEL = 6, //, "excel文档"),
  PPT = 7, //, "ppt文档"),
  OTHER = 99 //, "其他");
}

export type ClassSelectInfoType = {
  name?: string;
  resourceId?: string | number;
  weight?: number;
  fileSize?: string;
  type?: FileType;
  resourceType?: number;
};
