/** Calendar dates in the device's local timezone; never UTC slices. */
export function dateKey(date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`
}
export function addDays(key:string, days:number):string {
  const [year,month,day] = key.split('-').map(Number)
  return dateKey(new Date(year!,month!-1,day!+days,12))
}
export function isCalendarDate(key:string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(key) && addDays(key,0)===key
}
export function lastSevenDays(today=dateKey()) { return Array.from({length:7},(_,i)=>addDays(today,i-6)) }
