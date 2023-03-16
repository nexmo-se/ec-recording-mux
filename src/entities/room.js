// @flow
class MuxCredential{
    spaceId;
    spaceToken;
    broadcastId
  
    constructor(spaceId, spaceToken, broadcastId){
      this.spaceId = spaceId;
      this.spaceToken = spaceToken;
      this.broadcastId = broadcastId;
    }
  }
  export default MuxCredential;