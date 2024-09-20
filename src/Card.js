
import { cardFragmentShader, cardVertexShader } from "./shader/card"

export default class Card
{
    constructor(path)
    {

        
        this.texture = new THREE.Texture(path);
        this.cardGeometry = new THREE.PlaneGeometry(3, 5, 50, 50)
        this.cardMaterial = new THREE.ShaderMaterial({
            uniforms: {
                uMap: { value: this.texture },
                uStep: { value: 0.25 },
                uFrequency: { value: new THREE.Vector2(5, 1) },
                uTime: { value: 0 }
            },
            vertexShader: cardVertexShader,
            fragmentShader: cardFragmentShader,
            transparent: true,
        })
        this.cardMesh = new THREE.Mesh(this.cardGeometry, this.cardMaterial)

        
        
    }

}