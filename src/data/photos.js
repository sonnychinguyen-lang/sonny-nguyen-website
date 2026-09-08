import { asset } from '../asset.js'
// Personal photography. Captions are editable; frames follow the react-three-fiber image-gallery layout.
export const photos = [
  { id: 'english-bay-paddle', caption: 'English Bay, last light', url: asset('photos/english-bay-paddle.jpg') },
  { id: 'english-bay-sunset', caption: 'English Bay, sunset', url: asset('photos/english-bay-sunset.jpg') },
  { id: 'kits-beach', caption: 'Kits Beach, volleyball', url: asset('photos/kits-beach.jpg') },
  { id: 'stanley-park-drive', caption: 'Coal Harbour from Stanley Park', url: asset('photos/stanley-park-drive.jpg') },
  { id: 'canada-place', caption: 'Canada Place', url: asset('photos/canada-place.jpg') },
  { id: 'canada-place-portrait', caption: 'Canada Place, harbour', url: asset('photos/canada-place-portrait.jpg') },
  { id: 'harbour-air', caption: 'Harbour Air, Coal Harbour', url: asset('photos/harbour-air.jpg') },
  { id: 'seawall-second-narrows', caption: 'Seawall, Second Narrows', url: asset('photos/seawall-second-narrows.jpg') },
  { id: 'seawall-west-end', caption: 'Seawall, West End', url: asset('photos/seawall-west-end.jpg') },
  { id: 'north-van', caption: 'North Vancouver', url: asset('photos/north-van.jpg') },
  { id: 'brockton-totems', caption: 'Brockton Point totems', url: asset('photos/brockton-totems.jpg') },
  { id: 'azaleas', caption: 'Azaleas', url: asset('photos/azaleas.jpg') },
  { id: 'fuzhou-dusk', caption: 'Fuzhou, dusk', url: asset('photos/fuzhou-dusk.jpg') },
]
// Same arrangement as the pmndrs example (front / back / left / right), extended to 13 frames
const R = Math.PI / 2.5
export const layout = [
  { position: [0, 0, 1.5], rotation: [0, 0, 0] },
  { position: [-0.8, 0, -0.6], rotation: [0, 0, 0] },
  { position: [0.8, 0, -0.6], rotation: [0, 0, 0] },
  { position: [-1.75, 0, 0.25], rotation: [0, R, 0] },
  { position: [-2.15, 0, 1.5], rotation: [0, R, 0] },
  { position: [-2, 0, 2.75], rotation: [0, R, 0] },
  { position: [-2.3, 0, 4.0], rotation: [0, R, 0] },
  { position: [-2.55, 0, 5.25], rotation: [0, R, 0] },
  { position: [1.75, 0, 0.25], rotation: [0, -R, 0] },
  { position: [2.15, 0, 1.5], rotation: [0, -R, 0] },
  { position: [2, 0, 2.75], rotation: [0, -R, 0] },
  { position: [2.3, 0, 4.0], rotation: [0, -R, 0] },
  { position: [2.55, 0, 5.25], rotation: [0, -R, 0] },
]
