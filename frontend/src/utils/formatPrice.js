export default function formatPrice(num) {
    return num?.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
}
