const path = require('path');
const webpackConfig = require('./webpack.base.config.js');


module.exports = {
    //
    webpackConfig, //https://github.com/styleguidist/react-styleguidist/issues/1910, https://gist.github.com/nebomilic/938f93695b4ed6756fb37db757aca06f
    components: 'src/**/*.{js,jsx,tsx}',
    getExampleFilename(componentPath) {
      return componentPath.replace(/\.js?$/, '.md');
    },
    getComponentPathLine(componentPath) {
      const fileName = path.basename(componentPath, '.js');
      let dir = path.dirname(componentPath).replace('src', 'dist');
      dir = dir.split(path.sep).join("/");
      return `import ${fileName} from '@mapuiexts/react-olext/${dir}/${fileName}';`;
    },
    //
    pagePerSection: true,
    assetsDir: './docs',
    tocMode: 'collapse',
    title: 'React-OlExt',
    version: '0.1 Beta',
    styles: {
      Logo: {
        logo: {
          // we can now change the color used in the logo item to use the theme's `link` color
          color: '#61dafb'
        }
      }
    },
    theme: {
      sidebarWidth: '20%',
      maxWidth: 1300,
      color: {
        //base: '61dafb',
        //link: 'firebrick',
        link: '#61dafb',
        linkHover: 'salmon',
        sidebarBackground: '#000000',
        codeBase:'#FFF',
        baseBackground: '#FFF',
        codeBackground: '#000000',
        codeProperty: 'rgb(252, 146, 158)',
        codeString: 'rgb(250, 200, 99)',
        codeKeyword: 'rgb(197, 165, 197)',
        codeFunction:'rgb(121, 182, 242);',
        codePunctuation: 'rgb(136, 198, 190)',
        codeOperator: 'rgb(215, 222, 234)',
        codeComment: 'rgb(178, 178, 178)'
      },
    },
    //sectionDepth: 1,
    sections: [
      {
        name: 'Introduction',
        content: 'docs/introduction.md'
      },
      {
        name: 'Installation',
        content: 'docs/installation.md',
      },
      /*
      {
        name: 'Configuration',
        description: 'To be added',
        content: 'docs/configuration.md'
      },
      */
      {
        name: 'Live Demo',
        //description: 'To be added',
        //external: true,
        //href: 'http://example.com'
        content: 'docs/live_demo.md'
      },
      {
        name: 'UI Components',
        description: 'All the React-OlExt Components',
        sectionDepth: 1,
        sections: [
          {
            name: 'autoComplete',
            sectionDepth: 1,
            sections: [
              {
                name: 'projection',
                sectionDepth: 1,
                components: [
                  'src/components/autoComplete/projection/**/*.{js,jsx,ts,tsx}'
                ],
                exampleMode: 'expand', // 'hide' | 'collapse' | 'expand'
                usageMode: 'expand', // 'hide' | 'collapse' | 'expand'
              },
              {
                name: 'geocoder',
                sectionDepth: 1,
                components: [
                  'src/components/autoComplete/geocoder/**/*.{js,jsx,ts,tsx}'
                ],
                exampleMode: 'expand', // 'hide' | 'collapse' | 'expand'
                usageMode: 'expand', // 'hide' | 'collapse' | 'expand'
              }
            ]
          },
          {
            name: 'button',
            sectionDepth: 1,
            sections: [
              {
                name:'common',
                //content: 'docs/ui.md',
                sectionDepth: 1,
                components: [
                  'src/components/button/common/**/*.{js,jsx,ts,tsx}'
                ],
                exampleMode: 'expand', // 'hide' | 'collapse' | 'expand'
                usageMode: 'expand', // 'hide' | 'collapse' | 'expand'
              },
              {
                name:'coordinate',
                //content: 'docs/ui.md',
                sectionDepth: 1,
                components: [
                  'src/components/button/coordinate/**/*.{js,jsx,ts,tsx}'
                ],
                exampleMode: 'expand', // 'hide' | 'collapse' | 'expand'
                usageMode: 'expand', // 'hide' | 'collapse' | 'expand'
              },
              {
                name:'feature',
                //content: 'docs/ui.md',
                sectionDepth: 1,
                components: [
                  'src/components/button/feature/**/*.{js,jsx,ts,tsx}'
                ],
                exampleMode: 'expand', // 'hide' | 'collapse' | 'expand'
                usageMode: 'expand', // 'hide' | 'collapse' | 'expand'
              },
              {
                name:'layer',
                //content: 'docs/ui.md',
                sectionDepth: 1,
                components: [
                  'src/components/button/layer/**/*.{js,jsx,ts,tsx}'
                ],
                exampleMode: 'expand', // 'hide' | 'collapse' | 'expand'
                usageMode: 'expand', // 'hide' | 'collapse' | 'expand'
              },
              {
                name:'wfs',
                //content: 'docs/ui.md',
                sectionDepth: 1,
                components: [
                  'src/components/button/wfs/**/*.{js,jsx,ts,tsx}'
                ],
                exampleMode: 'expand', // 'hide' | 'collapse' | 'expand'
                usageMode: 'expand', // 'hide' | 'collapse' | 'expand'
              },
              {
                name:'wms',
                //content: 'docs/ui.md',
                sectionDepth: 1,
                components: [
                  'src/components/button/wms/**/*.{js,jsx,ts,tsx}'
                ],
                exampleMode: 'expand', // 'hide' | 'collapse' | 'expand'
                usageMode: 'expand', // 'hide' | 'collapse' | 'expand'
              },
              {
                name:'zoom',
                //content: 'docs/ui.md',
                sectionDepth: 1,
                components: [
                  'src/components/button/zoom/**/*.{js,jsx,ts,tsx}'
                ],
                exampleMode: 'expand', // 'hide' | 'collapse' | 'expand'
                usageMode: 'expand', // 'hide' | 'collapse' | 'expand'
              },

            ]
          },
          {
            name: 'control',
            //content: 'docs/ui.md',
            // components: [
            //   'src/components/control/**/*.{js,jsx,ts,tsx}'
            // ],
            // exampleMode: 'expand', // 'hide' | 'collapse' | 'expand'
            // usageMode: 'expand' // 'hide' | 'collapse' | 'expand'
            sections:[
              {
                name: 'map',
                sections: [
                  {
                    name: 'Controls',
                    description: 'The controls for the Map and MapOverview Widget',
                    components: [
                      'src/components/control/map/Controls/**/*.{js, jsx, ts, tsx}'
                    ],
                    exampleMode: 'expand', // 'hide' | 'collapse' | 'expand'
                    usageMode: 'expand', // 'hide' | 'collapse' | 'expand'
                  }
                ]
              }
            ]
          },
          {
            name: 'header',
            //content: 'docs/ui.md',
            components: [
              'src/components/header/**/*.{js,jsx,ts,tsx}'
            ],
            exampleMode: 'expand', // 'hide' | 'collapse' | 'expand'
            usageMode: 'expand' // 'hide' | 'collapse' | 'expand'
          },
          {
            name: 'grid',
            //content: 'docs/ui.md',
            components: [
              'src/components/grid/**/*.{js,jsx,ts,tsx}'
            ],
            exampleMode: 'expand', // 'hide' | 'collapse' | 'expand'
            usageMode: 'expand' // 'hide' | 'collapse' | 'expand'
          },
          {
            name: 'panel',
            //content: 'docs/ui.md',
            components: [
              'src/components/panel/**/*.{js,jsx,ts,tsx}'
            ],
            ignore: [
              'src/components/panel/Panel/Expander/**/*.{js,jsx,ts,tsx}',
              'src/components/panel/Panel/Header/**/*.{js,jsx,ts,tsx}'
            ],
            //sectionDepth: 3,
            exampleMode: 'expand', // 'hide' | 'collapse' | 'expand'
            usageMode: 'expand' // 'hide' | 'collapse' | 'expand'
          },
          {
            name: 'popup',
            //content: 'docs/ui.md',
            sections: [
              {
                name:'base',
                //content: 'docs/ui.md',
                components: [
                  'src/components/popup/base/**/*.{js,jsx,ts,tsx}'
                ],
                exampleMode: 'expand', // 'hide' | 'collapse' | 'expand'
                usageMode: 'expand' // 'hide' | 'collapse' | 'expand'
              },
            ]
          },
          {
            name: 'select',
            sections: [
              {
                name: 'projection',
                components: [
                  'src/components/select/projection/**/*.{js,jsx,ts,tsx}'
                ],
                exampleMode: 'expand', // 'hide' | 'collapse' | 'expand'
                usageMode: 'expand' // 'hide' | 'collapse' | 'expand'
              }
            ]
            
          },
          {
            name: 'slider',
            sections: [
              {
                name: 'layer',
                components: [
                  'src/components/slider/layer/**/*.{js,jsx,ts,tsx}'
                ],
                exampleMode: 'expand', // 'hide' | 'collapse' | 'expand'
                usageMode: 'expand', // 'hide' | 'collapse' | 'expand'
              },
              {
                name: 'heatmap',
                components: [
                  'src/components/slider/heatmap/**/*.{js,jsx,ts,tsx}'
                ],
                exampleMode: 'expand', // 'hide' | 'collapse' | 'expand'
                usageMode: 'expand', // 'hide' | 'collapse' | 'expand'
              }
            ]
          },
          {
            name: 'text',
            //content: 'docs/ui.md',
            components: [
              'src/components/text/**/*.{js,jsx,ts,tsx}'
            ],
            exampleMode: 'expand', // 'hide' | 'collapse' | 'expand'
            usageMode: 'expand' // 'hide' | 'collapse' | 'expand'
          },
          {
            name: 'tree',
            //content: 'docs/ui.md',
            components: [
              'src/components/tree/**/*.{js,jsx,ts,tsx}'
            ],
            exampleMode: 'expand', // 'hide' | 'collapse' | 'expand'
            usageMode: 'expand' // 'hide' | 'collapse' | 'expand'
          },
          {
            name: 'treeSelect',
            //content: 'docs/ui.md',
            components: [
              'src/components/treeSelect/**/*.{js,jsx,ts,tsx}'
            ],
            exampleMode: 'expand', // 'hide' | 'collapse' | 'expand'
            usageMode: 'expand' // 'hide' | 'collapse' | 'expand'
          },
          {
            name: 'widget',
            sections:[
              {
                name: 'map',
                components: [
                  'src/components/widget/map/**/*.{js,jsx,ts,tsx}'
                ],
                exampleMode: 'expand', // 'hide' | 'collapse' | 'expand'
                usageMode: 'expand' // 'hide' | 'collapse' | 'expand'
              }
            ]
          },
          {
            name: 'window',
            //content: 'docs/ui.md',
            sections: [
              {
                name: 'base',
                components: [
                  'src/components/window/base/**/*.{js,jsx,ts,tsx}'
                ],
                exampleMode: 'expand', // 'hide' | 'collapse' | 'expand'
                usageMode: 'expand' // 'hide' | 'collapse' | 'expand'
              }
            ]
          }
        ]
      },
      {
        name: 'Context',
        //content: 'docs/ui.md',
        components: [
            'src/context/**/*.{js,jsx,ts,tsx}'
        ],
        exampleMode: 'expand', // 'hide' | 'collapse' | 'expand'
        usageMode: 'expand' // 'hide' | 'collapse' | 'expand'
      },
      {
        name: 'Provider',
        //content: 'docs/ui.md',
        components: [
            'src/provider/**/*.{js,jsx,ts,tsx}'
        ],
        exampleMode: 'expand', // 'hide' | 'collapse' | 'expand'
        usageMode: 'expand' // 'hide' | 'collapse' | 'expand'
      },
      {
        name: 'Glossary',
        content: 'docs/glossary.md'
      },
    ]
}