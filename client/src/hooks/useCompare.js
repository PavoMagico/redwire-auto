const STORAGE_KEY = 'rwa_compare';
const MAX = 3;

export function useCompare() {
  const getList = () => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
    catch { return []; }
  };

  const saveList = (list) => localStorage.setItem(STORAGE_KEY, JSON.stringify(list));

  const addToCompare = (vehiculo) => {
    const list = getList();
    if (list.find(v => v.id_vehiculo === vehiculo.id_vehiculo)) return false;
    if (list.length >= MAX) return false;
    saveList([...list, vehiculo]);
    window.dispatchEvent(new Event('compare-updated'));
    return true;
  };

  const removeFromCompare = (id_vehiculo) => {
    saveList(getList().filter(v => v.id_vehiculo !== id_vehiculo));
    window.dispatchEvent(new Event('compare-updated'));
  };

  const clearCompare = () => {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event('compare-updated'));
  };

  const isInCompare = (id_vehiculo) => getList().some(v => v.id_vehiculo === id_vehiculo);

  return { getList, addToCompare, removeFromCompare, clearCompare, isInCompare };
}
