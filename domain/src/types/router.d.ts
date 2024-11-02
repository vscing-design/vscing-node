import type { RouteObject } from 'react-router-dom';

export type RouteMeta = {
  title: string;
  roles?: string[];
  icon?: string;
  sort?: number;
  iframeSrc?: string;
  KeepAlive?: boolean;
  hideTab?: boolean;
  hideMenu?: boolean;
  hideChildrenMenu?: boolean;
  level?: number;
};

// TODO 中间件
type MiddlewareType<T = React.PropsWithChildren> = React.FC<T>;

export type MergeRouteObject<M, N> = Omit<M, Extract<keyof M, keyof N>> & N;

export type RouteObjectType = MergeRouteObject<
  RouteObject,
  {
    component?: string;
    meta?: RouteMeta;
    redirect?: string;
    children?: RouteObjectType[];
    middleware?: MiddlewareType[];
  }
>;
