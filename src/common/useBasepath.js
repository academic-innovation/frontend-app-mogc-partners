import { useContext } from 'react';
import { AppContext } from '@edx/frontend-platform/react';

export default function useBasepath() {
  const { config } = useContext(AppContext);
  let basepath = config.PUBLIC_PATH;
  basepath = basepath.endsWith('/') ? basepath.substring(0, basepath.length - 1) : basepath;

  const addBasepath = (path) => `${basepath}${path}`;
  return { basepath, addBasepath };
}
