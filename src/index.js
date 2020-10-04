/*global jsyaml, p5*/
/*eslint no-undef: "error"*/

// Routes

let mainPage = `
    <Header>
      <HeaderTitle>
        <BrandLeft>programmatic</BrandLeft>.<BrandRight>art</BrandRight>
      </HeaderTitle>
      <Links>
        <NavLink class="link" id="about-link">About</NavLink>
        <NavLink class="link" onclick="window.location='https://ludusamo.com/blog'">Blog</NavLink>
      </Links>
    </Header>
    <hr/>
    <ArtCollection></ArtCollection>
    <hr/>
    <Footer>
      © <Year></Year> Brendan Horng • License <a href="https://github.com/Ludusamo/blog/blob/master/LICENSE">MIT</a>
    </Footer>
`

let aboutPage = `
  <Header>
      <HeaderTitle>
        <BrandLeft>programmatic</BrandLeft>.<BrandRight>art</BrandRight>
      </HeaderTitle>
      <Links>
        <NavLink class="link" id="gallery-link">Gallery</NavLink>
        <NavLink class="link" onclick="window.location='https://ludusamo.com/blog'">Blog</NavLink>
      </Links>
  </Header>
  <hr/>
  <p>
    This website was created by Brendan Horng. It is meant to be a gallery of animated art pieces using
    <a href='https://p5js.org/'>p5.js</a>. This website/concept is greatly inspired by
    <a href='https://thecodingtrain.com/'>The Coding Train</a>,
    <a href='https://beesandbombs.tumblr.com/'>bees & bombs</a>,
    and <a href='https://sasj.tumblr.com/'>Saskia Freeke</a>.
  </p>
  <hr/>
  <Footer>
    © <Year></Year> Brendan Horng • License <a href="https://github.com/Ludusamo/blog/blob/master/LICENSE">MIT</a>
  </Footer>
`
// Routing

let routes =
  { '/': { content: mainPage, load: mainPageLoad }
  , '/about': {content: aboutPage, load: aboutPageLoad }
  }

let parseRequestURL = () => {
  let url = location.hash.slice(1).toLowerCase() || '/'
  let r = url.split('/')
  let request = {
    resource: null,
    id: null
  }
  request.resource = r[1]
  request.id       = r[2]
  return request
}

const router = async () => {
  const content = null || document.getElementsByTagName('Content')[0]
  let request = parseRequestURL()
  let parsedURL = (request.resource ? '/' + request.resource : '/')
                + (request.id ? '/:id' : '')
  content.innerHTML = routes[parsedURL].content
  await routes[parsedURL].load(request.id)
}

const onNavLinkClick = (pathName, state={}) => {
  window.history.pushState(state, pathName, window.location.origin + pathName)
  router()
}

window.onpopstate = router
window.addEventListener('hashchange', router)
window.addEventListener('load', router)

// Scripting

function createArtElement(metadata) {
  const art = document.createElement('Art')
  const span = document.createElement('span')
  console.log(metadata)
  span.innerHTML = metadata.title
  art.appendChild(span)
  return art
}

async function getArtMetadata() {
  const res = await fetch('/programmatic-art/res/metadata.yml',
    { headers: {
        'Content-Type': 'application/yaml'
      }})
  const yamlContent = await res.text()
  return jsyaml.safeLoad(yamlContent).art
}

async function loadArt(artMetadata) {
  let artCollection = document.getElementsByTagName('ArtCollection')[0]
  console.log(artMetadata)
  for (const name in artMetadata) {
    const metadata = artMetadata[name]
    const artEle = createArtElement(metadata)
    artCollection.appendChild(artEle)

    const module = await import('../res/' + name + '.js')
    new p5(module.art, artEle)
  }
}

async function mainPageLoad() {
  const yearElements = document.getElementsByTagName('Year')
  for (let ele of yearElements) {
    ele.innerHTML = new Date().getFullYear()
  }
  const artMetadata = await getArtMetadata()
  await loadArt(artMetadata)

  document.getElementById('about-link').onclick = () => onNavLinkClick('/programmatic-art/#/about')
}

async function aboutPageLoad() {
  const yearElements = document.getElementsByTagName('Year')
  for (let ele of yearElements) {
    ele.innerHTML = new Date().getFullYear()
  }

  document.getElementById('gallery-link').onclick = () => onNavLinkClick('/programmatic-art')
}
