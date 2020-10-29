export const MedicalTest = (function(){
    function MedicalTest(id, createdByUser, uploadingImagesArr, labelsID, chosenTestType, indicatorsList, date, other){
      this.id = id;
      this.createdByUser = createdByUser;
      this.images = uploadingImagesArr || [];
      this.labels = labelsID;
      this.testType = chosenTestType;
      this.indicators = indicatorsList;
      this.date = date;
      this.other = other || '';
      this.dateModified =  new Date().getTime();
    }

    return MedicalTest;
})();
