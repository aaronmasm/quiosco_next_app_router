"use client";

import { useState } from "react";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";
import type {
  CloudinaryUploadWidgetResults,
  CloudinaryUploadWidgetInfo,
} from "next-cloudinary";
import { TbPhotoPlus } from "react-icons/tb";
import { getImagePath } from "@/src/utils";

export default function ImageUpload({ image }: { image: string | undefined }) {
  const [imageUrl, setImageUrl] = useState("");

  return (
    <CldUploadWidget
      onSuccess={(result: CloudinaryUploadWidgetResults, { widget }) => {
        if (result.event === "success") {
          widget.close();
          const info = result.info as CloudinaryUploadWidgetInfo;
          setImageUrl(info.secure_url);
        }
      }}
      uploadPreset="quiosco-next"
      options={{
        maxFiles: 1,
      }}
    >
      {({ open }) => (
        <>
          <div className="space-y-2">
            <label htmlFor="" className="text-slate-800">
              Imagen Producto
            </label>
            <div
              className="relative cursor-pointer hover:opacity-70 transition
              p-10 border-neutral-300 flex flex-col justify-center items-center
              gap-4 text-neutral-600 bg-slate-100"
              onClick={() => open()}
            >
              <TbPhotoPlus size={50} />
              <p className="text-lg font-semibold">Agregar Imagen</p>
              {imageUrl && (
                <div className="absolute inset-0 w-full h-full">
                  <Image
                    fill
                    style={{ objectFit: "contain" }}
                    src={imageUrl}
                    alt="Imagen de Producto"
                  />
                </div>
              )}
            </div>
          </div>

          {image && !imageUrl && (
            <div className="space-y-2">
              <label>Imagen Actual:</label>
              <div className="relative w-64 h-64">
                <Image fill src={getImagePath(image)} alt="Imagen Producto" />
              </div>
            </div>
          )}

          <input
            type="hidden"
            name="image"
            defaultValue={imageUrl ? imageUrl : image}
          />
        </>
      )}
    </CldUploadWidget>
  );
}
