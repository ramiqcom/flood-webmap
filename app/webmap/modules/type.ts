import { Map } from 'maplibre-gl';
import { Dispatch, StateUpdater } from 'preact/hooks';

export type SetState<T> = Dispatch<StateUpdater<T>>;

export type Option = { label: string; value: any; [key: string]: any };
export type Options = Option[];
export type Status = {
  message: string;
  type: 'success' | 'failed' | 'process' | 'other';
};

export type MainStore =
  | {
      map: Map;
      setMap: SetState<Map>;
      basemapId: string;
      basemap: Option;
      setBasemap: SetState<Option>;
      basemaps: Options;
      status: Status;
      setStatus: SetState<Status>;
      layers: Options;
      layer: Option;
      setLayer: SetState<Option>;
    }
  | Record<string, never>;
