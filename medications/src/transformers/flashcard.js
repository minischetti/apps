import {Transformer} from '@parcel/plugin';

function compile(source, sourceMap) {
  // Do some compilation
  console.log('Compiling flashcard', source, sourceMap)
  return {code, map};
}

export default new Transformer({
  async transform({asset}) {
    // Retrieve the asset's source code and source map.
    let source = await asset.getCode();
    let sourceMap = await asset.getMap();

    // Run it through some compiler, and set the results 
    // on the asset.
    let {code, map} = compile(source, sourceMap);
    asset.setCode(code);
    asset.setMap(map);

    // Return the asset
    return [asset];
  }
});