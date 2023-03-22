// @flow
class MuxCredential{
    name;
    spaceId;
    spaceToken;
    broadcastId
  
    constructor(name, spaceId, spaceToken, broadcastId){
      this.name = name
      this.spaceId = spaceId;
      this.spaceToken = spaceToken;
      this.broadcastId = broadcastId;
    }
  }
  export default MuxCredential;