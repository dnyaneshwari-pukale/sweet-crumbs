const CART_KEY='sweetCrumbsCart', ORDERS_KEY='sweetCrumbsOrders', LAST_ORDER_KEY='sweetCrumbsLastOrder';
const $=(s,root=document)=>root.querySelector(s); const $$=(s,root=document)=>[...root.querySelectorAll(s)];
function readStorage(key,fallback){try{const raw=localStorage.getItem(key); if(!raw)return fallback; const val=JSON.parse(raw); return val??fallback}catch(e){localStorage.removeItem(key);return fallback}}
function getCart(){const c=readStorage(CART_KEY,[]);return Array.isArray(c)?c.filter(i=>i&&i.id&&Number.isFinite(Number(i.quantity))&&Number(i.quantity)>0):[]}
function saveCart(cart){localStorage.setItem(CART_KEY,JSON.stringify(cart));updateCartCount()}
function formatCurrency(value){return `₹${Math.round(Number(value)||0).toLocaleString('en-IN')}`}
function calculateSubtotal(cart=getCart()){return cart.reduce((sum,i)=>sum+(Number(i.unitPrice)||0)*(Number(i.quantity)||0),0)}
function calculateDeliveryFee(cart=getCart()){return calculateSubtotal(cart)>0&&calculateSubtotal(cart)<999?50:0}
function calculateTotal(cart=getCart()){return calculateSubtotal(cart)+calculateDeliveryFee(cart)}
function updateCartCount(){const count=getCart().reduce((s,i)=>s+Number(i.quantity||0),0); $$('.cart-count').forEach(el=>el.textContent=count>99?'99+':count)}
function showToast(message,type='success'){const region=$('#toast-region');if(!region)return;const el=document.createElement('div');el.className=`toast ${type}`;el.textContent=message;region.appendChild(el);setTimeout(()=>el.remove(),3200)}
function imageFallback(img){img.addEventListener('error',()=>{img.src='data:image/svg+xml;charset=UTF-8,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600"><rect width="100%" height="100%" fill="#ead8d0"/><text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" fill="#843b50" font-family="sans-serif" font-size="28">Sweet Crumbs</text></svg>`);img.dataset.fallback='true'},{once:true})}
function setupNav(){const toggle=$('.menu-toggle'),links=$('.nav-links');toggle?.addEventListener('click',()=>{const open=links.classList.toggle('open');toggle.setAttribute('aria-expanded',open)});$$('img').forEach(imageFallback);updateCartCount()}
function cakeById(id){return CAKES.find(c=>c.id===id)}
function addItem(item){const cart=getCart();const match=cart.find(i=>i.id===item.id&&i.size===item.size&&i.eggless===item.eggless&&i.message===item.message);if(match)match.quantity=Math.min(10,match.quantity+Number(item.quantity||1));else cart.push({...item,quantity:Math.min(10,Number(item.quantity||1))});saveCart(cart);showToast(`${item.name} added to your cart`)}
function updateItemQuantity(index,delta){const cart=getCart();if(!cart[index])return;cart[index].quantity=Math.max(1,Math.min(10,cart[index].quantity+delta));saveCart(cart)}
function removeItem(index){const cart=getCart();if(!cart[index])return;const name=cart[index].name;cart.splice(index,1);saveCart(cart);showToast(`${name} removed from cart`)}
function generateOrderId(){const existing=readStorage(LAST_ORDER_KEY,'');if(existing)return existing;const id=`SC-${new Date().getFullYear()}-${Math.floor(10000+Math.random()*90000)}`;localStorage.setItem(LAST_ORDER_KEY,id);return id}
function validateEmail(v){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)} function validateMobile(v){return /^[6-9]\d{9}$/.test(v)} function validatePincode(v){return /^\d{6}$/.test(v)}
function todayISO(){return new Date().toISOString().split('T')[0]}
function setMinDate(input){if(input)input.min=todayISO()}
function qsParam(name){return new URLSearchParams(location.search).get(name)}
document.addEventListener('DOMContentLoaded',setupNav);
