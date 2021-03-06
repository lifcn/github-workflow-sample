import get from 'lodash/get'

export const itemTemplates = {
  tiles: {
    content: {
      title: 'Tile Title',
      text: 'Tile text'
    },
    image: {
      desktop: '//placeimg.com/960/604/tech',
      mobile: '//placeimg.com/640/400/tech',
      alt: '',
    },
    cta: {
      path: '/',
      label: 'Discover more',
    },
  },
  slider: {
    content: {
      title: 'Dream deals to update your bedroom',
    },
    image: {
      desktop: '//ucarecdn.com/ac23df71-d858-46ab-b7fa-e482102b323b/',
      mobile: '//ucarecdn.com/6232f3c3-acfb-47c3-b04f-7c74c3939ab7/',
      alt: 'Dream deals to update your bedroom',
    },
    cta: {
      path: '/retailer/david-jones',
    },
  },
  'tiles-short': {
    content: {
      text: 'Tile text'
    },
    image: {
      desktop: '//placeimg.com/960/604/tech',
      mobile: '//placeimg.com/640/400/tech',
      alt: '',
    },
    cta: {
      path: '/',
    },
  },
  images: {
    image: {
      mobile: "//ucarecdn.com/6232f3c3-acfb-47c3-b04f-7c74c3939ab7/",
      desktop: "//ucarecdn.com/ac23df71-d858-46ab-b7fa-e482102b323b/",
      alt: ''
    },
  },
}

const templates = [
  {
    label: 'Hero banner',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    data: {
      name: 'hero',
      props: {
        content: {
          text: 'Hero Text',
        },
        image: {
          desktop: "//i.ewalletcdn.com/8c238593-f39b-4bed-a9f2-efe69412e90e/",
          mobile: "//i.ewalletcdn.com/c7bc3b5e-7dd4-428b-bf1c-0d745cd8dc26/",
          alt: '',
        },
        gradient: 'dark',
        cta: {
          label: 'Discover more',
          path: '/',
        },
      },
    },
  },
  {
    label: 'Text',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    data: {
      name: 'text',
      props: {
        content: {
          text: 'Widget text',
        },
      }
    },
  },
  {
    label: 'Image',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    data: {
      name: 'image',
      props: {
        image: {
          mobile: "//ucarecdn.com/6232f3c3-acfb-47c3-b04f-7c74c3939ab7/",
          desktop: "//ucarecdn.com/ac23df71-d858-46ab-b7fa-e482102b323b/",
          alt: "Test alt text"
        },
      }
    },
  },
  {
    label: 'Images',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    data: {
      name: 'images',
      props: {
        wrapper: {
          space: true,
          row: {
            md: 2
          }
        },
        items: [
          itemTemplates.images,
          itemTemplates.images,
        ]
      }
    },
  },
  {
    label: 'Tile with image',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    data: {
      name: 'tile-image',
      props: {
        image: {
          mobile: '//ucarecdn.com/49d6d93d-9758-486e-be19-eeb129f49273/',
          desktop: '//ucarecdn.com/ac23df71-d858-46ab-b7fa-e482102b323b/',
          alt: '',
        },
        content: {
          title: 'Widget Title',
          text: 'Widget text',
        },
        cta: {
          path: '/',
          label: 'Discover more',
        },
        wrapper: {
          reverse: false,
          space: false,
        },
      }
    },
  },
  {
    label: 'Content tiles',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    data: {
      name: 'tiles',
      props: {
        items: [
          itemTemplates.tiles,
          itemTemplates.tiles,
          itemTemplates.tiles,
        ]
      }
    },
  },
  {
    label: 'Short content tiles',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    data: {
      name: 'tiles-short',
      props: {
        items: [
          itemTemplates['tiles-short'],
          itemTemplates['tiles-short'],
          itemTemplates['tiles-short'],
        ]
      }
    },
  },
  {
    label: 'Slider',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    data: {
      name: 'slider',
      props: {
        items: [
          itemTemplates.slider,
          itemTemplates.slider,
        ],
      }
    }
  },
  {
    label: 'Popular brands',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    data: {
      name: 'popular',
    },
  }
]

export function getTemplate(name) {
  return templates.find(template => {
    return get(template, 'data.name') === name
  })
}

export function getItemTemplate(name) {
  return itemTemplates[name]
}

export default templates
