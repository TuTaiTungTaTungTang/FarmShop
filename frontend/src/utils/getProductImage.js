// Xử lý link ảnh: nếu là link online thì dùng trực tiếp, nếu là file nội bộ thì nối backend_url
import { backend_url } from "../server";
export default function getProductImage(img) {
  if (!img) return "https://placehold.co/300x200?text=No+Image";
  return img.startsWith("http") ? img : `${backend_url}${img}`;
}