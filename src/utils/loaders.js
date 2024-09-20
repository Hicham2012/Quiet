function loadImage(pic, obj)
{
    const image = new Image()
    image.src = pic
    image.onload = function() {
        const texture = new THREE.Texture(image);
        texture.needsUpdate = true;

        obj.material.uniforms.uMap.value = texture
    }
}

export default loadImage;