import { useRecoilState, useSetRecoilState } from "recoil";
const apiUrl = import.meta.env.VITE_API_URL;
import Button from "./Button";
import Input from "./Input";
import {
  createPassword,
  Loading,
  ModifyPasswordState,
  passwordsAtom,
} from "../StateManagement/Atom";
import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export const PasswordForm = () => {
  const setVisiblity = useSetRecoilState(createPassword);
  const setLoading = useSetRecoilState(Loading);
  const setPasswordList = useSetRecoilState(passwordsAtom);
  const [modifyPass, setModifyPass] = useRecoilState(ModifyPasswordState);
  const { id, title, content, username, modifyPassword } = modifyPass;
  const [formData, setFormData] = useState({
    title: modifyPassword ? title : "",
    username: modifyPassword ? username : "",
    content: modifyPassword ? content : "",
  });

  const handleVisiblity = () => {
    setModifyPass((prevData) => ({
      ...prevData,
      modifyPassword: false,
    }));
    setVisiblity(false);
  };
  const handleChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleClick = async () => {
    if (modifyPassword) {
      await updatePassword();
    } else {
      await addPassword();
    }
  };

  const updatePassword = async () => {
    try {
      await axios.put(
        apiUrl + `password/update/${id}`,
        {
          title: formData.title,
          content: formData.content,
          username: formData.username,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      setPasswordList((prevList) =>
        prevList?.map((item) =>
          item.id === id ? { ...item, ...formData } : item
        )
      );
      setLoading(false);
      handleVisiblity();
      toast.success("Password added");
    } catch (err) {
      setLoading(false);
      toast.error("Internal server error");
    }
  };
  const addPassword = async () => {
    setLoading(true);
    try {
      await axios.post(
        apiUrl + "password/create",
        {
          title: formData.title,
          content: formData.content,
          username: formData.username,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      setLoading(false);
      handleVisiblity();
      toast.success("Password added");
    } catch (err) {
      setLoading(false);
      toast.error("Internal server error");
    }
  };

  return (
    <div className="fixed z-10 inset-0 bg-gray-500 bg-opacity-30 backdrop-blur-sm flex items-center justify-center">
      <div className="relative p-2 bg-white rounded w-[25rem] h-[30rem] overflow-auto">
        <div className="flex ">
          <div className="items-center justify-center flex mt-5 mb-5 flex-1 text-2xl font-bold">
            {modifyPassword ? "Update Password" : "Create Password"}
          </div>
          <button
            className="absolute mr-2 mt-0 right-0  rounded-md text-gray-400"
            onClick={handleVisiblity}
          >
            X
          </button>
        </div>
        <div className="flex flex-col gap-5">
          <Input
            label="Title"
            value={formData.title}
            type="text"
            name="title"
            placeholder="Enter Title"
            onChange={handleChange}
          />
          <Input
            label="Username"
            value={formData.username}
            type="text"
            name="username"
            placeholder="Enter username"
            onChange={handleChange}
          />
          <Input
            label="Password"
            value={formData.content}
            type="text"
            name="content"
            placeholder="Enter Password"
            onChange={handleChange}
          />
          <Button tag="Save" onClick={handleClick}></Button>
        </div>
      </div>
    </div>
  );
};
