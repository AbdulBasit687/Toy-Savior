// app/services/priceComparisonAPI.ts

export const getPriceComparison = async (toyName: string) => {
  await new Promise((res) => setTimeout(res, 500)); // simulate API delay

  const normalized = toyName.trim().toLowerCase();

  const mockDatabase = [
    {
      name: "barbie dream house",
      price: "12,499",
      url: "https://www.daraz.pk/products/barbie-dream-house-dollhouse-i123456.html",
    },
    {
      name: "remote control car",
      price: "2,999",
      url: "https://www.daraz.pk/products/high-speed-remote-control-car-i789012.html",
    },
    {
      name: "lego set",
      price: "499",
      url: "https://www.daraz.pk/products/super-hero-spiderman-mini-figure-bricks-collection-spider-man-minifigure-toy-for-kids-building-blocks-brick-best-educational-toys-gift-for-children-boys-girls-amazing-spider-man-collectable-figures-avengers-cartoon-character-spectacular-spidy-playset-i376417692-s1862168994.html?c=&channelLpJumpArgs=&clickTrackInfo=query%253Alego%252Bsuper%252Bhero%252Bset%253Bnid%253A376417692%253Bsrc%253ALazadaMainSrp%253Brn%253A40673c2a7195c797496290d8faff5cc6%253Bregion%253Apk%253Bsku%253A376417692_PK%253Bprice%253A499%253Bclient%253Adesktop%253Bsupplier_id%253A218%253Bbiz_source%253Ahttps%253A%252F%252Fwww.daraz.pk%252F%253Bslot%253A6%253Butlog_bucket_id%253A470687%253Basc_category_id%253A9108%253Bitem_id%253A376417692%253Bsku_id%253A1862168994%253Bshop_id%253A86170%253BtemplateInfo%253A-1_A3_C%25231103_L%2523&freeshipping=0&fs_ab=1&fuse_fs=&lang=en&location=Sindh&price=499&priceCompare=skuId%3A1862168994%3Bsource%3Alazada-search-voucher%3Bsn%3A40673c2a7195c797496290d8faff5cc6%3BoriginPrice%3A49900%3BdisplayPrice%3A49900%3BsinglePromotionId%3A-1%3BsingleToolCode%3AmockedSalePrice%3BvoucherPricePlugin%3A0%3Btimestamp%3A1750332294790&ratingscore=4.6923076923076925&request_id=40673c2a7195c797496290d8faff5cc6&review=13&sale=45&search=1&source=search&spm=a2a0e.searchlist.list.6&stock=1",
    },
  ];

  const match = mockDatabase.find((item) => item.name === normalized);

  if (match) {
    return [
      {
        platform: "Daraz",
        price: `Rs. ${match.price}`,
        url: match.url,
      },
    ];
  }

  return []; // No match
};
