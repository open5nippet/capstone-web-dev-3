const API = '/api';
export function getSession(){return JSON.parse(localStorage.getItem('campuscare_session') || 'null');}
export function setSession(data){localStorage.setItem('campuscare_session',JSON.stringify(data));}
export function clearSession(){localStorage.removeItem('campuscare_session');}
export async function request(path, options={}){const session=getSession();const response=await fetch(API+path,{...options,headers:{'Content-Type':'application/json',...(session?.token?{Authorization:`Bearer ${session.token}`}:{}) ,...options.headers}});const data=await response.json().catch(()=>({success:false,message:'Unexpected server response.'}));if(!response.ok)throw new Error(data.message||'Request failed.');return data;}
export function requireRole(role){const session=getSession();if(!session||session.user.role!==role){location.href='login.html';return null;}return session;}
export function logout(){clearSession();location.href='index.html';}
