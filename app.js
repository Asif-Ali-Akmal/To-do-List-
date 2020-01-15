const express=require("express");
const mongoose=require("mongoose")
const bodyParser=require("body-parser");
const _=require("lodash")

var app=express();
mongoose.connect("mongodb+srv://asif-khan:asifali_11@cluster0-bhk6d.mongodb.net/itemDB",{ useUnifiedTopology: true,useNewUrlParser: true } );

const itemsSchema=new mongoose.Schema({
  name:String
});
const listSchema={
  name:String,
  items:[itemsSchema]
};
const Item=mongoose.model("Item",itemsSchema);
const List=mongoose.model("List",listSchema);
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("Public"));
app.set("view engine","ejs");




const item1=new Item({
  name:"Welcome to todolist"
});
const item2=new Item({
  name:"Enter what you want to add"
});
const item3=new Item({
  name:"click checkbox for deletion"
});

const arr=[item1,item2,item3]
app.get("/",function(req,res){
  Item.find(function(err,items){
  if(items.length === 0){
    Item.insertMany(arr,function(err){
    
    });
    res.redirect("/");
  }else {
        res.render("list",{listtitle:"Today",Listitem:items});
  }
  });

});




app.post("/",function(req,res){
  var itemName=req.body.input;
  let listname=req.body.list;
  const newitem=new Item({
    name:itemName
  });
  if (listname === "Today") {
      newitem.save();
      res.redirect("/");
  }else {
    List.findOne({name:listname},function(err,result){
      result.items.push(newitem);
      result.save();
      res.redirect("/"+listname);
    });
  }
});

app.get("/about",function(req,res){
  res.render("about");
});


app.post("/delete",function(req,res){
  const itemId=req.body.checked;
  const listtitle=req.body.title;
  if (listtitle === "Today") {
    Item.deleteOne({_id:itemId},function(err){
    res.redirect("/");
  });
  } else {
    List.findOneAndUpdate({name:listtitle},{$pull:{items:{_id:itemId}}},function(err,result){
      if(!err){
        res.redirect("/"+listtitle);
      }
    });
  }
});

app.get("/:topic",function(req,res){
  const customlistname=_.capitalize(req.params.topic);
  console.log(customlistname);
  List.findOne({name:customlistname},function(err,result){
    if(!result){
        const newlist=new List({
          name:customlistname,
          items:arr
        });
        newlist.save();
        res.redirect("/"+customlistname);
      }else{
        res.render("list",{listtitle:customlistname,Listitem:result.items});
    }
  });
});
app.listen(process.env.PORT||3000,function(){
  console.log("Server is running succesfully at port 3000");
});
