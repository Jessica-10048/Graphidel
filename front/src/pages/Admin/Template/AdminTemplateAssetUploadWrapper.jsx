import { useParams } from "react-router";
import AdminTemplateAssetUpload from "./AdminTemplateAssetUpload";

const AdminTemplateAssetUploadWrapper=()=> {
  const { idOrSlug } = useParams();
  if (!idOrSlug) return null;
  return <AdminTemplateAssetUpload idOrSlug={idOrSlug} />;
}
export default AdminTemplateAssetUploadWrapper