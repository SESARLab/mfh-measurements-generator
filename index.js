const fs = require('fs');
const path = require('path');
const jsonexport = require('jsonexport');
const { addMinutes, addYears } = require('date-fns');
const chance = require('chance').Chance();

const unitsOfMeasure = [
  '%',
  'C',
  'W/m²',
  'cm',
  'kPa',
  'm/s',
  'mAh',
  'mV',
  'mm',
  'mm/m2',
  '°ang',
];

const sensors = [
  {
    sensor_id: "TS_0310B472-battery",
    sensor_type: "battery",
    sensor_desc_name: "ICON TS sensor group"
  },
  {
    sensor_id: "TS_0310B472-depth_soiltemperature",
    sensor_type: "depth_soiltemperature",
    sensor_desc_name: "ICON TS sensor group"
  },
  {
    sensor_id: "TS_0310B472-depth_swp1",
    sensor_type: "depth_swp1",
    sensor_desc_name: "ICON TS sensor group"
  },
  {
    sensor_id: "TS_0310B472-depth_swp2",
    sensor_type: "depth_swp2",
    sensor_desc_name: "ICON TS sensor group"
  },
  {
    sensor_id: "TS_0310B472-soiltemperature",
    sensor_type: "soiltemperature",
    sensor_desc_name: "ICON TS sensor group"
  },
  {
    sensor_id: "TS_0310B472-solarpanel",
    sensor_type: "solarpanel",
    sensor_desc_name: "ICON TS sensor group"
  },
  {
    sensor_id: "TS_0310B472-stress",
    sensor_type: "stress",
    sensor_desc_name: "ICON TS sensor group"
  },
  {
    sensor_id: "TS_0310B472-swp1",
    sensor_type: "swp1",
    sensor_desc_name: "ICON TS sensor group"
  },
  {
    sensor_id: "TS_0310B472-swp2",
    sensor_type: "swp2",
    sensor_desc_name: "ICON TS sensor group"
  },
  {
    sensor_id: "TS_0310B473-battery",
    sensor_type: "battery",
    sensor_desc_name: "ICON TS sensor group"
  },
  {
    sensor_id: "TS_0310B473-depth_soiltemperature",
    sensor_type: "depth_soiltemperature",
    sensor_desc_name: "ICON TS sensor group"
  },
  {
    sensor_id: "TS_0310B473-depth_swp1",
    sensor_type: "depth_swp1",
    sensor_desc_name: "ICON TS sensor group"
  },
  {
    sensor_id: "TS_0310B473-depth_swp2",
    sensor_type: "depth_swp2",
    sensor_desc_name: "ICON TS sensor group"
  },
  {
    sensor_id: "TS_0310B473-soiltemperature",
    sensor_type: "soiltemperature",
    sensor_desc_name: "ICON TS sensor group"
  },
  {
    sensor_id: "TS_0310B473-solarpanel",
    sensor_type: "solarpanel",
    sensor_desc_name: "ICON TS sensor group"
  },
  {
    sensor_id: "TS_0310B473-stress",
    sensor_type: "stress",
    sensor_desc_name: "ICON TS sensor group"
  },
  {
    sensor_id: "TS_0310B473-swp1",
    sensor_type: "swp1",
    sensor_desc_name: "ICON TS sensor group"
  },
  {
    sensor_id: "TS_0310B473-swp2",
    sensor_type: "swp2",
    sensor_desc_name: "ICON TS sensor group"
  },
  {
    sensor_id: "WS_0310B67D-airhumidity",
    sensor_type: "airhumidity",
    sensor_desc_name: "ICON WS sensor group"
  },
  {
    sensor_id: "WS_0310B67D-airtemperature",
    sensor_type: "airtemperature",
    sensor_desc_name: "ICON WS sensor group"
  },
  {
    sensor_id: "WS_0310B67D-battery",
    sensor_type: "battery",
    sensor_desc_name: "ICON WS sensor group"
  },
  {
    sensor_id: "WS_0310B67D-leafwetness",
    sensor_type: "leafwetness",
    sensor_desc_name: "ICON WS sensor group"
  },
  {
    sensor_id: "WS_0310B67D-pluviometer",
    sensor_type: "pluviometer",
    sensor_desc_name: "ICON WS sensor group"
  },
  {
    sensor_id: "WS_0310B67D-solarpanel",
    sensor_type: "solarpanel",
    sensor_desc_name: "ICON WS sensor group"
  },
  {
    sensor_id: "WS_0310B67D-solarradiation",
    sensor_type: "solarradiation",
    sensor_desc_name: "ICON WS sensor group"
  },
  {
    sensor_id: "WS_0310B67D-winddirection",
    sensor_type: "winddirection",
    sensor_desc_name: "ICON WS sensor group"
  },
  {
    sensor_id: "WS_0310B67D-windspeed",
    sensor_type: "windspeed",
    sensor_desc_name: "ICON WS sensor group"
  }
];

const locations = [
  {
    location_id: "sw_terrain",
    location_name: "Brazilian Glorytree",
    location_botanic_name: "Tibouchina granulosa (Desr.) Cogn.",
    location_cultivation_name: "Melastomataceae",
    location_description: "Organic full-range budgetary management"
  },
  {
    location_id: "sw_terrain",
    location_name: "Curtiss' Yelloweyed Grass",
    location_botanic_name: "Xyris difformis Chapm. var. curtissii (Malme) Kral",
    location_cultivation_name: "Xyridaceae",
    location_description: "Organic actuating moratorium"
  },
  {
    location_id: "cassoni_dx",
    location_name: "Saltwort Buckwheat",
    location_botanic_name: "Eriogonum salicornioides Gandog.",
    location_cultivation_name: "Polygonaceae",
    location_description: "Total transitional synergy"
  },
  {
    location_id: "cassoni_sx",
    location_name: "Texan Candyleaf",
    location_botanic_name: "Stevia ovata Willd. var. texana Grashoff",
    location_cultivation_name: "Asteraceae",
    location_description: "Vision-oriented demand-driven interface"
  },
  {
    location_id: "sw_terrain",
    location_name: "Chisos Oak",
    location_botanic_name: "Quercus graciliformis C.H. Mull.",
    location_cultivation_name: "Fagaceae",
    location_description: "Business-focused analyzing firmware"
  },
  {
    location_id: "sw_terrain",
    location_name: "Mojave Spikemoss",
    location_botanic_name: "Selaginella leucobryoides Maxon",
    location_cultivation_name: "Selaginellaceae",
    location_description: "Configurable 24/7 help-desk"
  },
  {
    location_id: "sw_terrain",
    location_name: "Purple Toadflax",
    location_botanic_name: "Linaria purpurea (L.) Mill.",
    location_cultivation_name: "Scrophulariaceae",
    location_description: "Polarised intangible model"
  },
  {
    location_id: "cassoni_sx",
    location_name: "Wain's Cup Lichen",
    location_botanic_name: "Cladonia wainioi Savicz",
    location_cultivation_name: "Cladoniaceae",
    location_description: "Open-architected needs-based knowledge user"
  },
  {
    location_id: "sw_terrain",
    location_name: "Texas Craglily",
    location_botanic_name: "Echeandia texensis Cruden",
    location_cultivation_name: "Liliaceae",
    location_description: "Multi-tiered multi-tasking firmware"
  },
  {
    location_id: "cassoni_sx",
    location_name: "Sessileflower False Goldenaster",
    location_botanic_name: "Heterotheca sessiliflora (Nutt.) Shinners ssp. echioides (Benth.) Semple var. camphorata (Eastw.) Semple",
    location_cultivation_name: "Asteraceae",
    location_description: "Grass-roots 6th generation architecture"
  },
  {
    location_id: "cassoni_sx",
    location_name: "Three-lobe Violet",
    location_botanic_name: "Viola triloba Schwein. var. dilatata (Elliott) Brainerd",
    location_cultivation_name: "Violaceae",
    location_description: "Cloned mobile firmware"
  },
  {
    location_id: "cassoni_dx",
    location_name: "Nannyberry",
    location_botanic_name: "Viburnum lentago L.",
    location_cultivation_name: "Caprifoliaceae",
    location_description: "Operative asymmetric framework"
  },
  {
    location_id: "sw_terrain",
    location_name: "Wheelscale Saltbush",
    location_botanic_name: "Atriplex elegans (Moq.) D. Dietr. var. fasciculata (S. Watson) M.E. Jones",
    location_cultivation_name: "Chenopodiaceae",
    location_description: "Down-sized mission-critical emulation"
  },
  {
    location_id: "cassoni_sx",
    location_name: "Sunflower",
    location_botanic_name: "Helianthus ×orgyaloides Cockerell (pro sp.)",
    location_cultivation_name: "Asteraceae",
    location_description: "Persevering multimedia software"
  },
  {
    location_id: "cassoni_dx",
    location_name: "Lodoicea",
    location_botanic_name: "Lodoicea Comm. ex Labill.",
    location_cultivation_name: "Arecaceae",
    location_description: "Persistent mobile support"
  },
  {
    location_id: "sw_terrain",
    location_name: "Yellowcress",
    location_botanic_name: "Rorippa Scop.",
    location_cultivation_name: "Brassicaceae",
    location_description: "Secured needs-based collaboration"
  },
  {
    location_id: "sw_terrain",
    location_name: "Prairie Goldenrod",
    location_botanic_name: "Oligoneuron album (Nutt.) G.L. Nesom",
    location_cultivation_name: "Asteraceae",
    location_description: "Cloned systematic internet solution"
  },
  {
    location_id: "sw_terrain",
    location_name: "Football Fruit",
    location_botanic_name: "Pangium edule Reinw. ex Blume",
    location_cultivation_name: "Flacourtiaceae",
    location_description: "Open-architected upward-trending system engine"
  },
  {
    location_id: "cassoni_sx",
    location_name: "Platygyrium Moss",
    location_botanic_name: "Platygyrium fuscoluteum Cardot",
    location_cultivation_name: "Hypnaceae",
    location_description: "Multi-lateral intermediate definition"
  },
  {
    location_id: "cassoni_dx",
    location_name: "Wirestem Buckwheat",
    location_botanic_name: "Eriogonum pharnaceoides Torr. var. cervinum Reveal",
    location_cultivation_name: "Polygonaceae",
    location_description: "Enterprise-wide executive functionalities"
  },
  {
    location_id: "cassoni_sx",
    location_name: "Rock Hedgenettle",
    location_botanic_name: "Stachys bigelovii A. Gray",
    location_cultivation_name: "Lamiaceae",
    location_description: "Progressive multi-tasking ability"
  },
  {
    location_id: "sw_terrain",
    location_name: "Field Groundcherry",
    location_botanic_name: "Physalis mollis Nutt. var. mollis",
    location_cultivation_name: "Solanaceae",
    location_description: "Progressive 6th generation definition"
  },
  {
    location_id: "cassoni_dx",
    location_name: "Chapman's Goldenrod",
    location_botanic_name: "Solidago odora Aiton var. chapmanii (A. Gray) Cronquist",
    location_cultivation_name: "Asteraceae",
    location_description: "Quality-focused background pricing structure"
  },
  {
    location_id: "cassoni_sx",
    location_name: "Mountain Ashdaisy",
    location_botanic_name: "Piptocarpha tetrantha Urb.",
    location_cultivation_name: "Asteraceae",
    location_description: "Automated systemic info-mediaries"
  },
  {
    location_id: "cassoni_dx",
    location_name: "Wallace's Spikemoss",
    location_botanic_name: "Selaginella wallacei Hieron.",
    location_cultivation_name: "Selaginellaceae",
    location_description: "Cross-group interactive website"
  },
  {
    location_id: "cassoni_sx",
    location_name: "Intermountain Bedstraw",
    location_botanic_name: "Galium serpenticum Dempster ssp. serpenticum",
    location_cultivation_name: "Rubiaceae",
    location_description: "Compatible real-time challenge"
  },
  {
    location_id: "cassoni_sx",
    location_name: "Buglossoides",
    location_botanic_name: "Buglossoides Moench",
    location_cultivation_name: "Boraginaceae",
    location_description: "Diverse bi-directional software"
  },
  {
    location_id: "cassoni_dx",
    location_name: "Condensed Snow Lichen",
    location_botanic_name: "Stereocaulon condensatum Hoffm.",
    location_cultivation_name: "Stereocaulaceae",
    location_description: "Extended motivating focus group"
  },
  {
    location_id: "cassoni_sx",
    location_name: "Kellogg's Umbrellawort",
    location_botanic_name: "Tauschia kelloggii (A. Gray) J.F. Macbr.",
    location_cultivation_name: "Apiaceae",
    location_description: "Ergonomic upward-trending implementation"
  },
  {
    location_id: "cassoni_sx",
    location_name: "Perfumeballs",
    location_botanic_name: "Gaillardia suavis (A. Gray & Engelm.) Britton & Rusby",
    location_cultivation_name: "Asteraceae",
    location_description: "Multi-lateral national website"
  },
  {
    location_id: "cassoni_dx",
    location_name: "Woodfern",
    location_botanic_name: "Dryopteris ×correllii W.H. Wagner",
    location_cultivation_name: "Dryopteridaceae",
    location_description: "Object-based client-driven attitude"
  },
  {
    location_id: "cassoni_dx",
    location_name: "Twoflower Melicgrass",
    location_botanic_name: "Melica mutica Walter",
    location_cultivation_name: "Poaceae",
    location_description: "Business-focused content-based frame"
  },
  {
    location_id: "cassoni_dx",
    location_name: "Thrift Seapink",
    location_botanic_name: "Armeria maritima (Mill.) Willd. ssp. maritima",
    location_cultivation_name: "Plumbaginaceae",
    location_description: "Enhanced multi-state framework"
  },
  {
    location_id: "cassoni_dx",
    location_name: "Mexican Bonebract",
    location_botanic_name: "Sclerocarpus uniserialis (Benth.) Hemsl.",
    location_cultivation_name: "Asteraceae",
    location_description: "Operative reciprocal matrix"
  },
  {
    location_id: "sw_terrain",
    location_name: "Shacklette's Cryptantha",
    location_botanic_name: "Cryptantha shackletteana Higgins",
    location_cultivation_name: "Boraginaceae",
    location_description: "Programmable asynchronous task-force"
  },
  {
    location_id: "sw_terrain",
    location_name: "Hairy Corkwood",
    location_botanic_name: "Leitneria pilosa J.A. Schrad. & W.R. Graves",
    location_cultivation_name: "Leitneriaceae",
    location_description: "Reactive human-resource support"
  },
  {
    location_id: "sw_terrain",
    location_name: "Japanese Poplar",
    location_botanic_name: "Populus maximowiczii A. Henry",
    location_cultivation_name: "Salicaceae",
    location_description: "Reduced directional hardware"
  },
  {
    location_id: "cassoni_sx",
    location_name: "Colorado Xanthoparmelia Lichen",
    location_botanic_name: "Xanthoparmelia coloradoensis (Gyel.) Hale",
    location_cultivation_name: "Parmeliaceae",
    location_description: "Customer-focused object-oriented firmware"
  },
  {
    location_id: "cassoni_dx",
    location_name: "Blackandwhite Sedge",
    location_botanic_name: "Carex albonigra Mack.",
    location_cultivation_name: "Cyperaceae",
    location_description: "Object-based coherent leverage"
  },
  {
    location_id: "sw_terrain",
    location_name: "Porter's Melicgrass",
    location_botanic_name: "Melica porteri Scribn.",
    location_cultivation_name: "Poaceae",
    location_description: "Upgradable stable system engine"
  },
  {
    location_id: "sw_terrain",
    location_name: "Sixweeks Grama",
    location_botanic_name: "Bouteloua barbata Lag.",
    location_cultivation_name: "Poaceae",
    location_description: "Multi-tiered regional workforce"
  },
  {
    location_id: "cassoni_sx",
    location_name: "Maritime Ceanothus",
    location_botanic_name: "Ceanothus maritimus Hoover",
    location_cultivation_name: "Rhamnaceae",
    location_description: "Proactive upward-trending capacity"
  },
  {
    location_id: "sw_terrain",
    location_name: "Giantspiral Lady's Tresses",
    location_botanic_name: "Spiranthes longilabris Lindl.",
    location_cultivation_name: "Orchidaceae",
    location_description: "Streamlined multimedia application"
  },
  {
    location_id: "cassoni_dx",
    location_name: "Thomson's Rim Lichen",
    location_botanic_name: "Lecanora thomsonii H. Magn.",
    location_cultivation_name: "Lecanoraceae",
    location_description: "Intuitive value-added process improvement"
  },
  {
    location_id: "cassoni_dx",
    location_name: "Sullivan City Flax",
    location_botanic_name: "Linum lundellii C.M. Rogers",
    location_cultivation_name: "Linaceae",
    location_description: "Secured 6th generation interface"
  },
  {
    location_id: "cassoni_sx",
    location_name: "Whitney's Sedge",
    location_botanic_name: "Carex whitneyi Olney",
    location_cultivation_name: "Cyperaceae",
    location_description: "Reactive dedicated hardware"
  },
  {
    location_id: "cassoni_sx",
    location_name: "Oblongleaf Stonecrop",
    location_botanic_name: "Sedum oblanceolatum R.T. Clausen",
    location_cultivation_name: "Crassulaceae",
    location_description: "Seamless system-worthy complexity"
  },
  {
    location_id: "cassoni_sx",
    location_name: "Crimson Bluestem",
    location_botanic_name: "Schizachyrium sanguineum (Retz.) Alston",
    location_cultivation_name: "Poaceae",
    location_description: "Distributed multimedia contingency"
  },
  {
    location_id: "cassoni_dx",
    location_name: "Chamisso Arnica",
    location_botanic_name: "Arnica chamissonis Less. ssp. foliosa (Nutt.) Maguire var. bernardina (Greene) Maguire",
    location_cultivation_name: "Asteraceae",
    location_description: "Profit-focused radical installation"
  },
  {
    location_id: "cassoni_sx",
    location_name: "Eutrema",
    location_botanic_name: "Eutrema R. Br.",
    location_cultivation_name: "Brassicaceae",
    location_description: "Decentralized disintermediate core"
  },
  {
    location_id: "cassoni_sx",
    location_name: "Long's Sedge",
    location_botanic_name: "Carex longii Mack.",
    location_cultivation_name: "Cyperaceae",
    location_description: "Team-oriented optimal parallelism"
  },
  {
    location_id: "cassoni_sx",
    location_name: "Western Cypress",
    location_botanic_name: "Hesperocyparis Bartel & R.A. Price",
    location_cultivation_name: "Cupressaceae",
    location_description: "Total multi-tasking access"
  },
  {
    location_id: "cassoni_dx",
    location_name: "Woollyleaf Manzanita",
    location_botanic_name: "Arctostaphylos tomentosa (Pursh) Lindl. ssp. tomentosa",
    location_cultivation_name: "Ericaceae",
    location_description: "Expanded impactful secured line"
  },
  {
    location_id: "sw_terrain",
    location_name: "Kidneywood",
    location_botanic_name: "Eysenhardtia Kunth",
    location_cultivation_name: "Fabaceae",
    location_description: "Customizable tertiary orchestration"
  },
  {
    location_id: "cassoni_dx",
    location_name: "Morton's Alpine Oatgrass",
    location_botanic_name: "Helictotrichon mortonianum (Scribn.) Henr.",
    location_cultivation_name: "Poaceae",
    location_description: "Synergistic methodical interface"
  },
  {
    location_id: "sw_terrain",
    location_name: "Wendt's Adder's-mouth Orchid",
    location_botanic_name: "Malaxis wendtii Salazar",
    location_cultivation_name: "Orchidaceae",
    location_description: "Versatile radical moratorium"
  },
  {
    location_id: "sw_terrain",
    location_name: "Grizzleybear Pricklypear",
    location_botanic_name: "Opuntia ×columbiana Griffiths (pro sp.)",
    location_cultivation_name: "Cactaceae",
    location_description: "Managed real-time archive"
  },
  {
    location_id: "cassoni_sx",
    location_name: "Mexican Yellow Star-grass",
    location_botanic_name: "Hypoxis mexicana Schult. & Schult. f.",
    location_cultivation_name: "Liliaceae",
    location_description: "Polarised exuding implementation"
  },
  {
    location_id: "sw_terrain",
    location_name: "Shameplant",
    location_botanic_name: "Mimosa pudica L.",
    location_cultivation_name: "Fabaceae",
    location_description: "Sharable 3rd generation instruction set"
  },
  {
    location_id: "cassoni_dx",
    location_name: "Dwarf Blue-eyed Grass",
    location_botanic_name: "Sisyrinchium minus Engelm. & A. Gray",
    location_cultivation_name: "Iridaceae",
    location_description: "Synchronised uniform success"
  },
  {
    location_id: "cassoni_dx",
    location_name: "Sticky Phlox",
    location_botanic_name: "Phlox viscida E.E. Nelson",
    location_cultivation_name: "Polemoniaceae",
    location_description: "Synergistic zero administration installation"
  },
  {
    location_id: "sw_terrain",
    location_name: "Harsh Indian Paintbrush",
    location_botanic_name: "Castilleja hispida Benth. ssp. hispida",
    location_cultivation_name: "Scrophulariaceae",
    location_description: "Persevering zero administration complexity"
  },
  {
    location_id: "sw_terrain",
    location_name: "Jesup's Hawthorn",
    location_botanic_name: "Crataegus jesupii Sarg.",
    location_cultivation_name: "Rosaceae",
    location_description: "Versatile non-volatile frame"
  },
  {
    location_id: "cassoni_dx",
    location_name: "French-grass",
    location_botanic_name: "Orbexilum onobrychis (Nutt.) Rydb.",
    location_cultivation_name: "Fabaceae",
    location_description: "Business-focused foreground array"
  },
  {
    location_id: "cassoni_sx",
    location_name: "Serpentine Linanthus",
    location_botanic_name: "Leptosiphon ambiguus (Rattan) J.M. Porter & L.A. Johnson",
    location_cultivation_name: "Polemoniaceae",
    location_description: "Versatile mobile extranet"
  },
  {
    location_id: "sw_terrain",
    location_name: "British Alkaligrass",
    location_botanic_name: "Puccinellia rupestris (With.) Fernald & Weath.",
    location_cultivation_name: "Poaceae",
    location_description: "Networked tangible forecast"
  },
  {
    location_id: "cassoni_dx",
    location_name: "Cylindricfruit Primrose-willow",
    location_botanic_name: "Ludwigia glandulosa Walter",
    location_cultivation_name: "Onagraceae",
    location_description: "Function-based web-enabled application"
  },
  {
    location_id: "cassoni_sx",
    location_name: "Reindeer Lichen",
    location_botanic_name: "Cladina (Nyl.) Nyl.",
    location_cultivation_name: "Cladoniaceae",
    location_description: "Optional multi-state access"
  },
  {
    location_id: "cassoni_sx",
    location_name: "New Mexico False Yucca",
    location_botanic_name: "Hesperaloe funifera (Lem.) Trel.",
    location_cultivation_name: "Agavaceae",
    location_description: "Persevering background support"
  },
  {
    location_id: "sw_terrain",
    location_name: "Secund Jewelflower",
    location_botanic_name: "Streptanthus glandulosus Hook. ssp. secundus (Greene) Kruckeb.",
    location_cultivation_name: "Brassicaceae",
    location_description: "Persistent actuating approach"
  },
  {
    location_id: "cassoni_sx",
    location_name: "Japanese Alder",
    location_botanic_name: "Alnus japonica (Thunb.) Steud.",
    location_cultivation_name: "Betulaceae",
    location_description: "Configurable web-enabled circuit"
  },
  {
    location_id: "cassoni_dx",
    location_name: "Imberis Woodyaster",
    location_botanic_name: "Xylorhiza tortifolia (Torr. & A. Gray) Greene var. imberbis (Cronquist) T.J. Watson",
    location_cultivation_name: "Asteraceae",
    location_description: "Multi-layered methodical interface"
  },
  {
    location_id: "sw_terrain",
    location_name: "False Hair Sedge",
    location_botanic_name: "Carex bulbostylis Mack.",
    location_cultivation_name: "Cyperaceae",
    location_description: "Down-sized modular open architecture"
  },
  {
    location_id: "cassoni_dx",
    location_name: "Napa Bluegrass",
    location_botanic_name: "Poa napensis Beetle",
    location_cultivation_name: "Poaceae",
    location_description: "Realigned zero tolerance success"
  },
  {
    location_id: "cassoni_sx",
    location_name: "Staghorn Fern",
    location_botanic_name: "Platycerium superbum de Jonch. & Hennipman",
    location_cultivation_name: "Polypodiaceae",
    location_description: "User-friendly mobile adapter"
  },
  {
    location_id: "cassoni_dx",
    location_name: "Daisy Bush",
    location_botanic_name: "Olearia Moench",
    location_cultivation_name: "Asteraceae",
    location_description: "Monitored tertiary access"
  },
  {
    location_id: "cassoni_dx",
    location_name: "Bushclover Dodder",
    location_botanic_name: "Cuscuta pentagona Engelm. var. pubescens (Engelm.) Yunck.",
    location_cultivation_name: "Cuscutaceae",
    location_description: "Virtual optimizing frame"
  },
  {
    location_id: "cassoni_sx",
    location_name: "Arctomia Lichen",
    location_botanic_name: "Arctomia interfixa (Nyl.) Vain.",
    location_cultivation_name: "Arctomiaceae",
    location_description: "De-engineered leading edge task-force"
  },
  {
    location_id: "cassoni_sx",
    location_name: "Spinycape",
    location_botanic_name: "Aristocapsa Reveal & Hardham",
    location_cultivation_name: "Polygonaceae",
    location_description: "Advanced responsive groupware"
  },
  {
    location_id: "cassoni_dx",
    location_name: "Palmyra Palm",
    location_botanic_name: "Borassus aethiopum Mart.",
    location_cultivation_name: "Arecaceae",
    location_description: "Organized national challenge"
  },
  {
    location_id: "cassoni_dx",
    location_name: "Boston Swordfern",
    location_botanic_name: "Nephrolepis exaltata (L.) Schott ssp. exaltata",
    location_cultivation_name: "Dryopteridaceae",
    location_description: "Triple-buffered directional archive"
  },
  {
    location_id: "sw_terrain",
    location_name: "Peach Springs Canyon Cholla",
    location_botanic_name: "Cylindropuntia abysii (Hester) Backeb.",
    location_cultivation_name: "Cactaceae",
    location_description: "Assimilated 24 hour analyzer"
  },
  {
    location_id: "cassoni_dx",
    location_name: "Lespedeza",
    location_botanic_name: "Lespedeza longifolia DC. (pro sp.)",
    location_cultivation_name: "Fabaceae",
    location_description: "Managed analyzing neural-net"
  },
  {
    location_id: "sw_terrain",
    location_name: "Japanese Dodder",
    location_botanic_name: "Cuscuta japonica Choisy",
    location_cultivation_name: "Cuscutaceae",
    location_description: "Synergized non-volatile core"
  },
  {
    location_id: "cassoni_dx",
    location_name: "Hassler's Noddingcaps",
    location_botanic_name: "Triphora hassleriana (Cogn.) Schltr.",
    location_cultivation_name: "Orchidaceae",
    location_description: "Public-key national instruction set"
  },
  {
    location_id: "cassoni_dx",
    location_name: "Campylopus Moss",
    location_botanic_name: "Campylopus atrovirens De Not.",
    location_cultivation_name: "Dicranaceae",
    location_description: "Adaptive scalable solution"
  },
  {
    location_id: "cassoni_dx",
    location_name: "Flowering Spurge",
    location_botanic_name: "Euphorbia corollata L.",
    location_cultivation_name: "Euphorbiaceae",
    location_description: "Re-contextualized composite moratorium"
  },
  {
    location_id: "sw_terrain",
    location_name: "Large Watergrass",
    location_botanic_name: "Luziola subintegra Swallen",
    location_cultivation_name: "Poaceae",
    location_description: "Multi-channelled real-time alliance"
  },
  {
    location_id: "cassoni_sx",
    location_name: "Day's Bedstraw",
    location_botanic_name: "Galium serpenticum Dempster ssp. dayense Dempster & Ehrend.",
    location_cultivation_name: "Rubiaceae",
    location_description: "Multi-lateral full-range collaboration"
  },
  {
    location_id: "cassoni_sx",
    location_name: "Fringepetal Kittentails",
    location_botanic_name: "Synthyris schizantha Piper",
    location_cultivation_name: "Scrophulariaceae",
    location_description: "User-centric attitude-oriented infrastructure"
  },
  {
    location_id: "sw_terrain",
    location_name: "False Goat's Beard",
    location_botanic_name: "Astilbe Buch.-Ham. ex D. Don",
    location_cultivation_name: "Saxifragaceae",
    location_description: "Re-engineered web-enabled knowledge user"
  },
  {
    location_id: "sw_terrain",
    location_name: "Fringeleaf Lobelia",
    location_botanic_name: "Lobelia fenestralis Cav.",
    location_cultivation_name: "Campanulaceae",
    location_description: "Assimilated transitional time-frame"
  },
  {
    location_id: "sw_terrain",
    location_name: "Bicknell's Cranesbill",
    location_botanic_name: "Geranium bicknellii Britton",
    location_cultivation_name: "Geraniaceae",
    location_description: "Cross-platform 4th generation array"
  },
  {
    location_id: "cassoni_sx",
    location_name: "Giant White Wakerobin",
    location_botanic_name: "Trillium albidum J.D. Freeman",
    location_cultivation_name: "Liliaceae",
    location_description: "Universal global intranet"
  },
  {
    location_id: "cassoni_sx",
    location_name: "Ribbed Fringepod",
    location_botanic_name: "Thysanocarpus radians Benth.",
    location_cultivation_name: "Brassicaceae",
    location_description: "Progressive uniform concept"
  },
  {
    location_id: "sw_terrain",
    location_name: "California Dandelion",
    location_botanic_name: "Taraxacum californicum Munz & I.M. Johnst.",
    location_cultivation_name: "Asteraceae",
    location_description: "Diverse 6th generation parallelism"
  },
  {
    location_id: "sw_terrain",
    location_name: "Elatior Hybrid Primroses",
    location_botanic_name: "Primula ×polyantha Mill. (pro sp.)",
    location_cultivation_name: "Primulaceae",
    location_description: "Reverse-engineered even-keeled success"
  },
  {
    location_id: "cassoni_dx",
    location_name: "Pygmy Smartweed",
    location_botanic_name: "Polygonum minus Huds.",
    location_cultivation_name: "Polygonaceae",
    location_description: "Multi-layered fault-tolerant function"
  },
  {
    location_id: "cassoni_sx",
    location_name: "Rio Chama Blazingstar",
    location_botanic_name: "Mentzelia conspicua T.K. Todsen",
    location_cultivation_name: "Loasaceae",
    location_description: "Public-key asynchronous initiative"
  },
  {
    location_id: "sw_terrain",
    location_name: "Hammock Bog Orchid",
    location_botanic_name: "Habenaria distans Griseb.",
    location_cultivation_name: "Orchidaceae",
    location_description: "Focused 24/7 implementation"
  }
];

const agents = [
  'icon_agent',
  'rover_agent',
];

const NUMBER_OF_ROWS = 5_000_000;
const JSON_OUTPUT = path.resolve(`${__dirname}/data/output`, `dl_measurements-${Date.now()}.ndjson`);
const MIN_LATITUDE = 45.38676;
const MAX_LATITUDE = 45.53582;
const MIN_LONGITUDE = 9.04091;
const MAX_LONGITUDE = 9.27808;
const MIN_ALTITUDE = 1;
const MAX_ALTITUDE = 10;
const DATE = new Date();
const PAST_DATE = addYears(DATE, -1);
const MEASUREMENT = 'MEASUREMENT';
const PHASE = 'PHASE';
const TAG = 'TAG';

function getMeasurementType(sensorType) {
  switch (sensorType) {
    case 'airhumidity':
    case 'airtemperature':
    case 'battery':
    case 'depth_soiltemperature':
    case 'leafwetness':
    case 'pluviometer':
    case 'soiltemperature':
    case 'winddirection':
    case 'windspeed':
      return MEASUREMENT;
    case 'depth_swp1':
    case 'depth_swp2':
    case 'solarpanel':
    case 'solarradiation':
    case 'swp1':
    case 'swp2':
      return PHASE;
    case 'stress':
      return TAG;
    default:
      return MEASUREMENT;
  }
}

function getMeasurement(sensorType) {
  const measurementType = getMeasurementType(sensorType);
  const unit_of_measure = chance.pickone(unitsOfMeasure);

  if (measurementType === PHASE) {
    return {
      double_value: null,
      str_value: `${chance.floating({ min: 10, max: 120, fixed: 2 })} - ${chance.floating({ min: 10, max: 120, fixed: 2 })}`,
      unit_of_measure,
    };
  }

  if (measurementType === TAG) {
    return {
      double_value: chance.floating({ min: 1, max: 10, fixed: 2 }),
      str_value: `Value: ${chance.floating({ min: 10, max: 120, fixed: 2 })}`,
      unit_of_measure,
    };
  }

  return {
    double_value: chance.floating({ min: 1, max: 10, fixed: 2 }),
    str_value: null,
    unit_of_measure,
  };
}

function getMeasurementTimestamps(sensorType) {
  const measurementType = getMeasurementType(sensorType);
  const measurementTimestamp = chance.date({ min: PAST_DATE, max: DATE });
  const insertionTimestamp = addMinutes(measurementTimestamp, chance.integer({ min: 20, max: 60 }));

  if (measurementType === PHASE) {
    const endTimestamp = addMinutes(measurementTimestamp, chance.integer({ min: 1, max: 5 }));

    return {
      measure_timestamp: null,
      start_timestamp: measurementTimestamp.toISOString(),
      end_timestamp: endTimestamp.toISOString(),
      insertion_timestamp: insertionTimestamp.toISOString(),
    };
  }

  return {
    measure_timestamp: measurementTimestamp.toISOString(),
    start_timestamp: null,
    end_timestamp: null,
    insertion_timestamp: insertionTimestamp.toISOString(),
  };
}

function getLocation() {
  const location = chance.pickone(locations);

  return {
    ...location,
    location_latitude: chance.latitude({ min: MIN_LATITUDE, max: MAX_LATITUDE, fixed: 6 }),
    location_longitude: chance.longitude({ min: MIN_LONGITUDE, max: MAX_LONGITUDE, fixed: 6 }),
    location_altitude: chance.floating({ min: MIN_ALTITUDE, max: MAX_ALTITUDE, fixed: 2 }),
  };
}

function getSensor() {
  return chance.pickone(sensors);
}

function getAgent() {
  return {
    insertion_agent: chance.pickone(agents),
  };
}

(function run() {
  const stream = fs.createWriteStream(JSON_OUTPUT, { flags: 'a' });

  for (let i = 0; i < NUMBER_OF_ROWS; i++) {
    const sensor = getSensor();
    const location = getLocation();
    const measurement = getMeasurement(sensor.sensor_type);
    const timestamps = getMeasurementTimestamps(sensor.sensor_type);
    const agent = getAgent();
  
    const row = {
      id: chance.guid(),
      ...measurement,
      ...sensor,
      ...location,
      ...agent,
      ...timestamps
    };

    stream.write(`${JSON.stringify(row)}\n`);
  }

  stream.end();
})();

