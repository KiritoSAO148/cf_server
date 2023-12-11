const News = require("../models/News");

const newsController = {
  gets: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const totalNews = await News.countDocuments();
      const perPage = parseInt(req.query.perPage) || totalNews;

      const startIndex = (page - 1) * perPage;
      const endIndex = page * perPage;

      const newsList = await News.find()
        .skip(startIndex)
        .limit(endIndex)
        .populate({
          path: "author",
          model: "User",
          select: "_id username fullname avatar",
        });
      return res.status(200).json({ newsList, page, perPage, totalNews });
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  create: async (req, res) => {
    try {
      const news = await News.create(req.body);
      return res.status(201).json(news);
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  update: async (req, res) => {
    try {
      const news = await News.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (!news) {
        return res.status(400).json("News not found");
      }
      return res.status(200).json(news);
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  delete: async (req, res) => {
    try {
      const news = await News.findByIdAndDelete(req.params.id);
      if (!news) {
        return res.status(400).json("News not found");
      }
      return res.status(200).json("Deleted news");
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  updateView: async (req, res) => {
    try {
      const news = await News.findById(req.params.id);
      if (!news) {
        return res.status(400).json({ error: "News not found" });
      }
      await news.updateOne({ viewCount: news.viewCount + 1 });
      return res.status(200).json(true);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  updateLike: async (req, res) => {
    try {
      const news = await News.findById(req.params.id);
      if (!news) {
        return res.status(400).json({ error: "News not found" });
      }
  
      const userIndex = news.likeCount.indexOf(req.params.userId);
      if (userIndex !== -1) {
        news.likeCount.splice(userIndex, 1);
      } else {
        news.likeCount.push(req.params.userId);
      }
  
      await news.save();
  
      return res.status(200).json(true);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
};

module.exports = newsController;
