import axios from "axios";
import sha1 from "js-sha1";

export const uploadFileCloudinary = async (file) => {
    try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "qirecrzg");
        formData.append("folder", "clothing_shop");
        const response = await axios.post(
            "https://api.cloudinary.com/v1_1/dqxshljwn/upload",
            formData
        );

        return response.data.url;
    } catch (error) {
        throw error;
    }
};

export const extractPublicId = (url) => {
  const match = url.match(/\/v\d+\/(.+?)\./);
  return match ? match[1] : null;
};

export const deleteFileCloudinary = async (publicId) => {
    const cloudName = "dqxshljwn";
    const apiKey = "886584392256712";
    const apiSecret = "NGj29hoB1nxuKrbMael2GCF22Mg";

    const timestamp = new Date().getTime();
    const string = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
    const signature = sha1(string);

    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`;

    try {
        const response = await axios.post(url, {
            public_id: publicId,
            api_key: apiKey,
            api_secret: apiSecret,
            signature: signature,
            timestamp: timestamp,
        });
        console.log(response);

        if (response.data.result === "ok") {
            console.log("Ảnh đã được xóa thành công");
            return true;
        } else {
            console.error("Không thể xóa ảnh");
            return false;
        }
    } catch (error) {
        console.error("Lỗi khi xóa ảnh:", error);
        return false;
    }
};