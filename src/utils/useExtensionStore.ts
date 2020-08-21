import {
  useEffect,
  useState,
  useRef,
  Dispatch,
  SetStateAction
} from 'react';
import {
  CommonServiceIds,
  IExtensionDataService
} from 'azure-devops-extension-api';
import {
  getExtensionContext,
  getService,
  getAccessToken
} from 'azure-devops-extension-sdk';

const useExtensionStore = <T>(name: string, defaultValue?: T) => {
  const [initialValue, setInitialValue] = useState<T>();
  const [value, setValue] = useState<T>();
  const [loading, setLoading] = useState(false);
  const { id } = getExtensionContext();

  useEffect(() => {
    Promise.all([
      getAccessToken(),
      getService<IExtensionDataService>(CommonServiceIds.ExtensionDataService)
    ])
      .then(values => {
        const [token, service] = values;
        return service.getExtensionDataManager(id, token);
      })
      .then(manager => manager.getValue<T>(name))
      .catch(e => Promise.resolve({} as T))
      .then(value => {
        setInitialValue(value);
        setLoading(false);
      });
  }, [name]);

  useEffect(() => {
    if (!value) {
      return;
    }

    Promise.all([
      getAccessToken(),
      getService<IExtensionDataService>(CommonServiceIds.ExtensionDataService)
    ])
      .then(values => {
        const [token, service] = values;
        return service.getExtensionDataManager(id, token);
      })
      .then(manager => manager.setValue<T>(name, value as T))
      .then(_ => {
      });
  }, [value]);

  return [value as T || initialValue || defaultValue, setValue, loading] as [
    T,
    Dispatch<SetStateAction<T | undefined>>,
    boolean
  ];
};

export default useExtensionStore;
