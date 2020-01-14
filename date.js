exports.getDate=function(){
  var today=new Date();
  var options={
    weekday:"long",
    day:"numeric",
    month:"long"
  };
  return day=today.toLocaleDateString("en-US",options);
}
exports.getDay=function(){
  var today=new Date();
  var options={
    weekday:"long",
  };
  var day=today.toLocaleDateString("en-US",options);
  return day;
}
