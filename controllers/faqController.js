const cheerio = require("cheerio");
const request = require("request-promise");

const url = "https://nest.botble.com/vi/faq";

const faqController = {
  get: async (req, res) => {
    try {
      const data = [];

      const html = await request(url);
      const $ = cheerio.load(html);

      const faqsLists = $(".faqs-list");

      for (let i = 0; i < faqsLists.length; i++) {
        const faqList = faqsLists.eq(i);
        const titles = faqList
          .find("h4")
          .map((index, el) => $(el).text())
          .get();

        const accordions = faqList.find(".accordion");
        const cardsData = [];

        for (let j = 0; j < accordions.length; j++) {
          const accordion = accordions.eq(j);
          const cardData = {
            title: titles[j],
            cards: [],
          };

          const cards = accordion.find(".card");
          cards.each((index, card) => {
            cardData.cards.push({
              header: $(card).find(".card-header button").text(),
              body: $(card).find(".card-body").text(),
            });
          });

          cardsData.push(cardData);
        }

        data.push(...cardsData);
      }

      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
};

module.exports = faqController;
