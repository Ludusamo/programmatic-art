/*global jsyaml, p5, moment*/
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
    <div class="pagination">
      <a href="#/page/1">&laquo;</a>
    </div>
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

let artPage = `
  <Header>
      <HeaderTitle>
        <BrandLeft>programmatic</BrandLeft>.<BrandRight>art</BrandRight>
      </HeaderTitle>
      <Links>
        <NavLink class="link" id="gallery-link">Gallery</NavLink>
        <NavLink class="link" id="about-link">About</NavLink>
        <NavLink class="link" onclick="window.location='https://ludusamo.com/blog'">Blog</NavLink>
      </Links>
  </Header>
  <hr/>
  <p>
    <ArtDisplay>
      <SingleArtView></SingleArtView>
      <ArtInfo>
        <name>
          <EleName>Name:</EleName>
        </name>
        <date>
          <EleName>Date:</EleName>
        </date>
        <tags>
          <EleName>Tags:</EleName>
        </tags>
      </ArtInfo>
    </ArtDisplay>
  </p>
  <hr/>
  <Footer>
    © <Year></Year> Brendan Horng • License <a href="https://github.com/Ludusamo/blog/blob/master/LICENSE">MIT</a>
  </Footer>
`
// Routing

let currentPageContext = null

let routes =
  { '/': { content: mainPage, load: mainPageLoad }
  , '/about': {content: aboutPage, load: aboutPageLoad }
  , '/page/:id': { content: mainPage, load: mainPageLoad }
  , '/art/:id': { content: artPage, load: artPageLoad }
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
  if (currentPageContext) currentPageContext.unload()
  currentPageContext = await routes[parsedURL].load(request.id)
}

const onNavLinkClick = (pathName, state={}) => {
  window.history.pushState(state, pathName, window.location.origin + pathName)
  router()
}

// window.onpopstate = router
window.addEventListener('hashchange', router)
window.addEventListener('load', router)

// Scripting

const NUM_ART_PER_PAGE = 12
const ART_SIZE = 400
const SINGLE_ART_SIZE = ART_SIZE * 2

function artByDateDesc(artMetadata) {
  let arr = []
  for (let name in artMetadata) {
    arr.push([name, artMetadata[name].date])
  }
  arr.sort((a, b) => b[1] - a[1])
  return arr.map(x => x[0])
}

function createArtElement(metadata) {
  const art = document.createElement('Art')
  const span = document.createElement('span')
  span.innerHTML = metadata.title
  art.appendChild(span)
  return art
}

async function getArtMetadata() {
  const res = await fetch('/res/metadata.yml',
    { headers: {
        'Content-Type': 'application/yaml'
    }})
  const yamlContent = await res.text()
  return jsyaml.safeLoad(yamlContent).art
}

function unloadArt(art) {
  for (let a of art) {
    a.remove()
  }
}

async function loadArt(artMetadata, page) {
  let artCollection = document.getElementsByTagName('ArtCollection')[0]
  artCollection.innerHTML = ''
  let art = []
  const artOffset = NUM_ART_PER_PAGE * (page - 1)
  const numArt = Object.keys(artMetadata).length
  for (let i = artOffset; i < Math.min(artOffset + NUM_ART_PER_PAGE, numArt); i++) {
    const name = artByDateDesc(artMetadata)[i]
    const metadata = artMetadata[name]
    const artEle = createArtElement(metadata)
    artEle.onclick = () => onNavLinkClick('#/art/' + name)
    artCollection.appendChild(artEle)

    const module = await import('../res/' + name + '.js')
    art.push(new p5(module.art(ART_SIZE, ART_SIZE), artEle))
  }
  return art
}

function createPaginationLink(page, active, content) {
  content = content || page
  const pageLink = document.createElement('a')
  if (active) {
    pageLink.classList.add('active')
  }
  pageLink.href = '#/page/' + page
  pageLink.innerHTML = content
  return pageLink
}

function setupPagination(page, numArt) {
  let pagination = document.getElementsByClassName('pagination')
  let numPages = Math.ceil(numArt / NUM_ART_PER_PAGE)
  for (let i = 1; i <= numPages; i++) {
    pagination[0].append(createPaginationLink(i, page == i))
  }
  pagination[0].append(createPaginationLink(numPages, false, '&raquo;'))
}

async function mainPageLoad(page) {
  page = page || 1
  const yearElements = document.getElementsByTagName('Year')
  for (let ele of yearElements) {
    ele.innerHTML = new Date().getFullYear()
  }
  const artMetadata = await getArtMetadata()
  let art = await loadArt(artMetadata, page)
  setupPagination(page, Object.keys(artMetadata).length)
  currentPageContext =
    { art: art
    , unload: () => unloadArt(art)
    }

  document.getElementById('about-link').onclick = () => onNavLinkClick('/#/about')
  return currentPageContext
}

function setArtInfo(metadata) {
  let artInfo = document.getElementsByTagName('ArtInfo')[0]
  let tagsEle = document.createElement('tags')
  let createEle = (content) => {
    let ele = document.createElement('div')
    ele.innerHTML = content
    return ele
  }
  for (let tag of metadata.tags) {
    let tagEle = document.createElement('tag')
    tagEle.classList.add('chip')
    tagEle.innerHTML = tag
    tagsEle.appendChild(tagEle)
  }
  const info =
    { name: createEle(metadata['title'])
    , date: createEle(moment(metadata['date']).format('YYYY-MM-DD'))
    , tags: tagsEle
    }

  for (let infoSlot of artInfo.children) {
    infoSlot.appendChild(info[infoSlot.localName])
  }
}

async function loadSingleArt(artMetadata, name) {
  let singleArtView = document.getElementsByTagName('SingleArtView')[0]
  singleArtView.innerHTML = ''
  const metadata = artMetadata[name]
  const artEle = createArtElement(metadata)
  singleArtView.appendChild(artEle)
  setArtInfo(metadata)
  const module = await import('../res/' + name + '.js')
  let artSize = Math.max(ART_SIZE, Math.min(SINGLE_ART_SIZE, SINGLE_ART_SIZE * window.screen.width / 2560))
  let art = [new p5(module.art(artSize, artSize), artEle)]
  return art
}

async function artPageLoad(name) {
  const yearElements = document.getElementsByTagName('Year')
  for (let ele of yearElements) {
    ele.innerHTML = new Date().getFullYear()
  }
  const artMetadata = await getArtMetadata()
  let art = await loadSingleArt(artMetadata, name)
  currentPageContext =
    { art: art
    , unload:
      () => unloadArt(art)
    }

  document.getElementById('gallery-link').onclick = () => onNavLinkClick('/')
  document.getElementById('about-link').onclick = () => onNavLinkClick('/#/about')
  return currentPageContext
}

async function aboutPageLoad() {
  const yearElements = document.getElementsByTagName('Year')
  for (let ele of yearElements) {
    ele.innerHTML = new Date().getFullYear()
  }

  document.getElementById('gallery-link').onclick = () => onNavLinkClick('/')
  return null
}
