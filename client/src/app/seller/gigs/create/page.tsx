"use client";
import { categories } from "@/utils/categories";
import React, { useState } from "react";
import ImageUpload from "../../../../components/ImageUpload";
import axios from "axios";
import { ADD_GIG } from "@/utils/constants";
import { useRouter } from "next/navigation";
import { useCookies } from "react-cookie";

const Create = () => {
  const [cookies] = useCookies();
  const router = useRouter();
  const [files, setFiles] = useState([]);
  const [features, setFeatures] = useState([]);
  const [data, setData] = useState({
    title: "",
    category: "",
    description: "",
    time: 0,
    revisions: 0,
    feature: "",
    price: 0,
    shortDesc: "",
  });
  const inputClassName =
    "block p-4 w-full text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500";
  const labelClassName =
    "mb-2 text-lg font-medium text-gray-900 dark:text-white";
  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };
  const addFeature = () => {
    if (data.feature) {
      setFeatures([...features, data.feature]);
      setData({ ...data, feature: "" });
    }
  };
  const removeFeature = (i) => {
    const filteredFeature = [...features];
    filteredFeature.splice(i, 1);
    setFeatures(filteredFeature);
  };

  const addGig = async () => {

    const { title, category, description, time, revisions, price, shortDesc } =
      data;
    try {
      if (
        title &&
        category &&
        description &&
        time > 0 &&
        revisions > 0 &&
        features.length &&
        price > 0 &&
        shortDesc.length &&
        files.length
      ) {
        console.log("amma")
        const formData = new FormData();
        files.forEach((file) => {
          formData.append("images", file);
        });
        const gigData = {
          title,
          category,
          description,
          time,
          revisions,
          price,
          shortDesc,
          features,
        };
        console.log("asi")
        const response = await axios.post(ADD_GIG, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${cookies.token}`,
          },
          params: gigData,
        });
        console.log('paisi')
        if (response.status === 201) {
          router.push("/seller/gigs");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="mt-36 min-h-[80vh] my-10 px-32">
      <h1 className="text-4xl text-gray-900 mb-5">Create a new Gig</h1>
      <h3 className="text-2xl text-gray-900 mb-5">
        Enter the details to create the gig
      </h3>
      <div className="flex flex-col gap-5 mt-10">
        <div className="grid grid-cols-2 gap-11">
          <div>
            <label htmlFor="title" className={labelClassName}>
              Gig Title
            </label>
            <input
              type="text"
              name="title"
              className={inputClassName}
              value={data.title}
              onChange={handleChange}
              placeholder="eg. I will do something i am really good at"
              required
              id="title"
            />
          </div>
          <div>
            <label htmlFor="category" className={labelClassName}>
              Select a Category
            </label>
            <select
              onChange={handleChange}
              name="category"
              id="category"
              className="bg-gray-50  border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 w-full p-4"
            >
              {categories.map(({ name }) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label htmlFor="description" className={labelClassName}>
            Gig description
          </label>
          <textarea
            name="description"
            id="description"
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Write a short description"
            value={data.description}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="grid grid-cols-2 gap-11">
          <div className="">
            <label htmlFor="delivery" className={labelClassName}>
              Gig delivery
            </label>
            <input
              type="number"
              name="time"
              className={inputClassName}
              value={data.time}
              onChange={handleChange}
              placeholder="minimum delivery time"
              required
              id="delivery"
            />
          </div>
          <div className="">
            <label htmlFor="revision" className={labelClassName}>
              Gig Revision
            </label>
            <input
              type="number"
              name="revisions"
              className={inputClassName}
              value={data.revisions}
              onChange={handleChange}
              placeholder="max number of revisions"
              required
              id="revision"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-11">
          <div>
            <label htmlFor="features" className={labelClassName}>
              Gig Features
            </label>
            <div className="flex gap-3 items-center mb-5">
              <input
                type="text"
                name="feature"
                className={inputClassName}
                value={data.feature}
                onChange={handleChange}
                placeholder="enter feature name"
                required
                id="features"
              />
              <button
                type="button"
                className="focus:outline-none text-white bg-blue-700 hover:bg-blue-800  font-medium  text-lg px-10 py-3 rounded-md "
                onClick={addFeature}
              >
                Add
              </button>
            </div>

            <ul className="flex gap-2 flex-wrap">
              {features.map((feature, i) => (
                <li
                  key={i}
                  className="flex gap-2 items-center py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-red-700 cursor-pointer hover:border-red-200"
                >
                  <span>{feature}</span>
                  <span
                    className="text-red-700"
                    onClick={() => removeFeature(i)}
                  >
                    X
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <label htmlFor="image" className={labelClassName}>
              Gig Images
            </label>
            <div>
              <ImageUpload files={files} setFiles={setFiles} />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-11">
          <div>
            <label htmlFor="shortDesc" className={labelClassName}>
              Short Description
            </label>
            <input
              type="text"
              name="shortDesc"
              className={inputClassName}
              value={data.shortDesc}
              onChange={handleChange}
              placeholder="enter a short description"
              required
              id="shortDesc"
            />
          </div>
          <div>
            <label htmlFor="price" className={labelClassName}>
              Gig Price ($)
            </label>
            <input
              type="number"
              name="price"
              className={inputClassName}
              value={data.price}
              onChange={handleChange}
              placeholder="Enter a price"
              required
              id="price"
            />
          </div>
        </div>
        <div>
          <button
            className="border text-lg font-semibold px-5 py-3 border-green-500 bg-green-500 text-white rounded-md"
            type="button"
            onClick={addGig}
          >
            Add Gig
          </button>
        </div>
      </div>
    </div>
  );
};

export default Create;
