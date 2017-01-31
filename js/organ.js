class Organ{

  constructor(pos, model, texture,name="", infos=""){

    this.vertexBuffer = null;
    this.indexBuffer = null;
    this.textureBuffer = null;
    this.normalsBuffer = null;

    this.pos = pos;
    this.model = model;
    this.texture = texture;
    this.name = name;
    this.printed = true;
    this.infos =infos;


    this.vertexBuffersArray = [];
    this.indexBuffersArray = [];
    this.textureBuffersArray = [];
    this.normalBuffersArray = [];
    this.indicesArray = [];

    this.mvMatrix = mat4.create();
    this.nMatrix = mat4.create();

    this.texColorTab = new Array();

    this.init();

  }

  setInformations(infos){
      this.infos = infos;
  }

  handleOBJModel(filename, data)
  {
  	console.info(filename + ' has been retrieved from the server');
  	var objData = new OBJ.Mesh(data);
  	this.vertexBuffer = getVertexBufferWithVertices(objData.vertices);
  	this.normalsBuffer = getVertexBufferWithVertices(objData.vertexNormals);
  	this.textureBuffer = getVertexBufferWithVertices(objData.textures);
  	this.indexBuffer = getIndexBufferWithIndices(objData.indices);

  	this.vertexBuffersArray.push(this.vertexBuffer);
  	this.normalBuffersArray.push(this.normalsBuffer);
  	this.textureBuffersArray.push(this.textureBuffer);
  	this.indexBuffersArray.push(this.indexBuffer);
  	this.indicesArray.push(objData.indices);
  }

  loadModel(filename)
  {
  	var request = new XMLHttpRequest();
  	console.info('Requesting ' + filename);
  	request.open("GET",filename);
    var actual;
    actual = this;
  	request.onreadystatechange = function() {
  	  if (request.readyState == 4) {
  		if(request.status == 404) {
  			console.info(filename + ' does not exist');
  		 }
  		else {
        actual.handleOBJModel(filename, request.responseText);
        }
  	  }
  	}
  	request.send();
  }

  init(){
    this.clearBuffers();

    this.indices = [];
    this.vertices = [];
    this.loadModel(this.model);
    initTextureWithImage(this.texture, this.texColorTab );

    this.vertexBuffer = getVertexBufferWithVertices(this.vertices);
    this.indexBuffer  = getIndexBufferWithIndices(this.indices);
    //Affiche l'objet dans le bon sens au départ (coeur face à nous)
    this.rotateObjOnXAxis(-90);
  }

  //This method clears the buffer
  clearBuffers()
  {
    if(this.vertexBuffer != null)
    {
      glContext.deleteBuffer(this.vertexBuffer);
    }

    if(this.indexBuffer != null)
    {
      glContext.deleteBuffer(this.indexBuffer);
    }
  }

  //Fonctions de rotation
  rotateObjOnXAxis(degre){
     var rotXQuat = quat.create();
     quat.setAxisAngle(rotXQuat, [1, 0, 0], degToRad(degre));
     var rotationMatrix = mat4.create();
     mat4.identity(rotationMatrix);
     mat4.fromQuat(rotationMatrix, rotXQuat);
     mat4.multiply(this.mvMatrix, rotationMatrix, this.mvMatrix);
   }
 rotateObjOnYAxis(degre){
    var rotYQuat = quat.create();
    quat.setAxisAngle(rotYQuat, [0, 1, 0], degToRad(degre));
    var rotationMatrix = mat4.create();
    mat4.identity(rotationMatrix);
    mat4.fromQuat(rotationMatrix, rotYQuat);
    mat4.multiply(this.mvMatrix, rotationMatrix,this.mvMatrix);
  }


  drawObject(parent,mvMatrix){
    //On l'affiche seulement si on doit
    if(this.printed){
      if(this.indicesArray.length > 0){

        mat4.multiply(parent, mvMatrix, this.mvMatrix);
        glContext.uniformMatrix4fv(prg.mvMatrixUniform, false, parent);

        mat4.copy(this.nMatrix, this.mvMatrix);
        mat4.invert(this.nMatrix, this.nMatrix);
        mat4.transpose(this.nMatrix, this.nMatrix);

        // Transfer of the normals matrice
        glContext.uniformMatrix4fv(prg.nMatrixUniform, false, this.nMatrix);
        glContext.bindBuffer(glContext.ARRAY_BUFFER, this.vertexBuffer);
        // Transfer of the vertices
        glContext.vertexAttribPointer(prg.vertexPositionAttribute, 3, glContext.FLOAT, false, 0, 0);
        glContext.bindBuffer(glContext.ARRAY_BUFFER, this.normalsBuffer);
        //Transfer of the normal vertices
        glContext.vertexAttribPointer(prg.vertexNormalAttribute, 3, glContext.FLOAT, false, 0, 0);
        glContext.bindBuffer(glContext.ARRAY_BUFFER, this.textureBuffer);
        // Transfer of the indexes for the textures
        glContext.vertexAttribPointer(prg.textureCoordsAttribute, 2, glContext.FLOAT, false, 0, 0);
        glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

        glContext.activeTexture(glContext.TEXTURE0);
        glContext.bindTexture(glContext.TEXTURE_2D, this.texColorTab[0]);
        glContext.uniform1i(prg.colorTextureUniform, 0);
        glContext.drawElements(glContext.TRIANGLES, this.indicesArray[0].length, glContext.UNSIGNED_SHORT,0);
      }
    }
  }
}
