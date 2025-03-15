import { Response } from "express";
import { prisma } from "../db/db";
import Cryptr from "cryptr";

const cryptr = new Cryptr(process.env.CRYPTR_SECRET as string);
const getAll = async (req: any, res: Response) => {
  try {
    const id = req.user.id;
    const contents = await prisma.post.findMany({
      where: {
        ownerId: id,
      },
      orderBy: { createdAt: "asc" },
    });
    // await Promise.all(contents.map(async e => {
    //   e.content = await cryptr.decrypt(e.content as string)
    // }));

    res.status(200).json(contents);
  } catch (err) {
    console.error("Error fetching passwords:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const createPassword = async (req: any, res: Response) => {
  try {
    const { title, content, username } = req.body;
    const encryptPass = cryptr.encrypt(content);
    await prisma.post.create({
      data: {
        title: title,
        content: encryptPass,
        username: username,
        ownerId: req.user.id,
      },
    });
    res.json({
      message: "Password added successfully",
    });
  } catch (err) {
    throw "Internal server error";
  }
};
const modifyPassword = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const { content, title, username } = req.body;
    const post = await prisma.post.findUnique({
      where: {
        id: parseInt(id),
        ownerId: req.user.id,
      },
    });
    if (!post) {
      res.status(404).json({ message: "Not Found" });
      return;
    }
    await prisma.post.update({
      where: {
        id: parseInt(id),
        ownerId: req.user.id,
      },
      data: {
        content: content ? content : post?.content,
        username: username ? username : post?.username,
        title: title ? title : post?.title,
      },
    });
    res.status(200).json({ message: "Post updated successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server errror" });
  }
};

const deletePassword = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const post = await prisma.post.findUnique({
      where: {
        id: parseInt(id),
        ownerId: req.user.id,
      },
    });
    if (!post) {
      res.status(404).json({ message: "Invalid any" });
      return;
    }
    await prisma.post.delete({
      where: {
        id: parseInt(id),
      },
    });
    res.status(200).json({ message: "Password Deleted Successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const sharePassword = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const { uuid } = req.body;
    const user = await prisma.user.findUnique({
      where: {
        uuid,
      },
    });
    if (!user) {
      res.status(404).json({ message: "Invalid share Id" });
      return;
    }
    const post = await prisma.post.findUnique({
      where: {
        id: parseInt(id),
        ownerId: req.user.id,
      },
    });
    if (!post) {
      res.status(404).json({ message: "Invalid Post" });
      return;
    }
    await prisma.post.create({
      data: {
        title: post.title,
        content: post.content,
        ownerId: user.id,
        sharedAt: new Date(),
      },
    });
    res.status(200).json({ message: "Password shared" });
  } catch (err) {
    console.log(err);
    res.status(500).json("Internal server error");
  }
};
export {
  getAll,
  createPassword,
  modifyPassword,
  deletePassword,
  sharePassword,
};
