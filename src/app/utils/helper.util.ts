import * as ps from 'ps-node';

const _psLookupPromiseWrapper = (pid) => {
  return new Promise((resolve, reject) => {
    ps.lookup({pid: pid}, (err, resultList) => {
      if (err) {
        reject(err);
      }
      resolve(resultList);
    });
  });
};

const _psKillPromisWrapper = (pid) => {
  return new Promise((resolve, reject) => {
    ps.kill(pid, 'SIGKILL', (err) => {
      if (err) {
        reject(err);
      }
      resolve(true);
    });
  });
};

export const arrayBufferToString = (arr) => {
  if (!(arr instanceof Uint8Array)) {
    return arr;
  }
  return (new TextDecoder('utf-8')).decode(arr);
};

export const isActuallyKilled = async (pid) => {
  if (!pid) {
    return true;
  }

  try {
    const processes: any  = await _psLookupPromiseWrapper(pid);
    const childProcess    = processes.length > 0 ? processes[0] : null;
    if (childProcess) {
      return false;
    }
    return true;
  } catch (e) {
    return -1;
  }
};

export const forceKillProcess = async (pid) => {
  try {
    const killed = await _psKillPromisWrapper(pid);
    return killed;
  } catch (e) {
    return false;
  }
};
