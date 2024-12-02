"use client";
// import { createProduct } from "@/lib/actions";
import { Category, Product, Color as ColorType } from "@prisma/client";
import axios from "axios";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";
import Image from "next/image";
import { createProduct, updateProduct } from "@/actions";

interface FormProductProps {
  categories: Category[];
  product?: Product & { colors: ColorType[] };
}

interface Color {
  id?: number;
  color: string;
  quantity: number;
}

export default function FormProduct({ categories, product }: FormProductProps) {
  const imagesLocal = JSON.parse(localStorage.getItem("images") || "[]");
  const [images, setImages] = useState<string[]>(
    product ? product.images : imagesLocal,
  );
  const router = useRouter();
  const [deleteColors, setDeleteColors] = useState<number[]>([]);

  const [colors, setColors] = useState<Color[]>(
    product
      ? product.colors
      : [
          {
            color: "#000000",
            quantity: 0,
          },
        ],
  );

  async function handleSubmit(formData: FormData) {
    const results = product
      ? await updateProduct(formData, colors, images, product.id, deleteColors)
      : await createProduct(formData, colors, images);

    if (results.success) {
      localStorage.setItem("images", JSON.stringify([]));
      toast.success(
        product ? "Update product success" : "Create product success",
      );
      router.push("/products");
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: results.error,
      });
    }
  }

  function handleAddColor() {
    setColors([...colors, { color: "#000000", quantity: 0 }]);
  }

  function handleDeleteColor(index: number, id?: number) {
    console.log('Deleting color at index:', index, 'with id:', id);
    if(id){
      setDeleteColors([...deleteColors, id]);
    }
    setColors(colors.filter((_, i) => i !== index));
    
  }

  function handleChangeColor(index: number, color: string, quantity: number) {
    // const newColors = colors.map((item, i) => {
    //   if (i === index) {
    //     return { color, quantity: quantity };
    //   }
    //   return item;
    // });
    setColors(
      colors.map((c, i) => (i === index ? { ...c, color, quantity } : c)),
    );
  }

  async function handleUploadImages(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    try {
      const files = event.target.files ? Array.from(event.target.files) : [];

      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file);
      });

      const { data } = await axios.post("/api/images", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setImages([...images, ...data.uploadedFiles]);
      localStorage.setItem(
        "images",
        JSON.stringify([...images, ...data.uploadedFiles]),
      );

      toast.success("Upload file success");
    } catch (err: any) {
      console.log(err);
    }
  }
  async function handleDeleteImage(filename: string) {
    try {
      await axios.delete(`/api/images/${filename}`);

      const newImages = images.filter((image) => image !== filename);
      localStorage.setItem("images", JSON.stringify(newImages));
      setImages(newImages);

      toast.success("Delete file success");
    } catch (err: any) {
      console.log(err);
      toast.error(err?.response?.data?.message || "Delete file failed");
    }
  }

  
  return (
    <div>
      <div className="grid grid-cols-2">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              Create Products
            </h3>
          </div>
          <form action={handleSubmit}>
            {/* form product  */}
            <div className="p-6.5">
              <div className="mb-4.5">
                {/* name  */}
                <div className="mb-3">
                  <label className="block text-sm font-medium text-black dark:text-white">
                    Name
                  </label>
                  <input
                    defaultValue={product?.name}
                    type="text"
                    required
                    name="name"
                    placeholder="Enter Product name"
                    className="mb-4.5 w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
                <div className="mb-3">
                  <label className="block text-sm font-medium text-black dark:text-white">
                    Company
                  </label>
                  <input
                    defaultValue={product?.company}
                    type="text"
                    required
                    name="company"
                    placeholder="Enter Company name"
                    className="mb-4.5 w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                {/* price  */}
                <div className="mb-3">
                  <label className="block text-sm font-medium text-black dark:text-white">
                    Price
                  </label>
                  <input
                    defaultValue={product?.price}
                    type="number"
                    required
                    name="price"
                    placeholder="Rp. 0"
                    className="mb-4.5 w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                {/* select category  */}
                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Category
                  </label>

                  <div className="relative z-20 bg-white dark:bg-form-input">
                    <select
                      name="categoryId"
                      className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white`}
                    >
                      {categories.map((category) => (
                        <option
                          defaultValue={product?.categoryId}
                          key={category.id}
                          value={category.id}
                          className="text-body dark:text-bodydark"
                        >
                          {category.name}
                        </option>
                      ))}
                    </select>

                    <span className="absolute right-4 top-1/2 z-10 -translate-y-1/2">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g opacity="0.8">
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                            fill="#637381"
                          ></path>
                        </g>
                      </svg>
                    </span>
                  </div>
                </div>

                {/* Color */}
                <div className="my-4.5">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Color
                  </label>
                  {colors.map((item, index) => (
                    <div key={index} className="mb-4.5 grid grid-cols-5 gap-5">
                      <input
                        onChange={(e) =>
                          handleChangeColor(
                            index,
                            e.target.value,
                            item.quantity,
                          )
                        }
                        defaultValue={item?.color}
                        value={item.color}
                        type="color"
                        required
                        name="color"
                        className="col-span-2 h-full w-full rounded border-[1.5px] border-stroke bg-transparent px-1 py-1 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      />
                      <input
                        onChange={(e) =>
                          handleChangeColor(
                            index,
                            item.color,
                            Number(e.target.value),
                          )
                        }
                        defaultValue={item?.quantity}
                        type="number"
                        required
                        name="quantity"
                        placeholder="0"
                        className="col-span-2 w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      />

                      <button
                        type="button"
                        onClick={() => handleDeleteColor(index)}
                        className="col-span-1 w-full rounded-md bg-red py-3 text-white"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddColor}
                    className="mb-4.5 w-full rounded-md bg-black py-3 text-white transition-opacity hover:bg-black/90"
                  >
                    Add Color
                  </button>
                </div>
                {/* End Color */}
                {/* attach file images  */}
                <div className="mb-4.5">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Attach file Images
                  </label>
                  <input
                    name="files"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleUploadImages}
                    className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:px-5 file:py-3 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
                  />
                </div>
                {/* description  */}
                <div className="mb-6">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Description
                  </label>
                  <textarea
                    defaultValue={product?.description || ""}
                    rows={6}
                    name="description"
                    placeholder="Enter description"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  ></textarea>
                </div>
              </div>

              <button
                type="submit"
                className={`flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 `}
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
      {/* preview images  */}
      <div className="grid w-full grid-cols-2 gap-5">
        {images.map((image, i) => (
          <div
            key={i}
            className="relative aspect-square rounded bg-white shadow-md"
          >
            <Image
              src={`${process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_IMAGE}/${image}`}
              alt="test"
              fill
              className="object-contain"
            />

            <button
              onClick={() => handleDeleteImage(image)}
              className="absolute -right-4 -top-4 rounded-full bg-red p-3 text-white transition-opacity hover:bg-red/90"
            >
              <X />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
