//jshint esversion:6

const express = require("express");//express
const bodyParser = require("body-parser");//bodyParser
const mongoose=require("mongoose");//mongoose
const _=require("lodash");

const app = express();//app

app.set('view engine', 'ejs');//seeting view engine to use express

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));//so it sees in public folder to see static files

mongoose.connect("mongodb+srv://Rohan-Kacheria:Rmk9930042066@cluster0.9cth0.mongodb.net/todolistDB",{useNewUrlParser:true,useUnifiedTopology:true});//connecting to mongoose

//creating a schema named items
const itemsSchema={
  name:String
};

//creating a mongoose model
const Item=mongoose.model("Item",itemsSchema);

const item1=new Item({
  name:"Welcome to your todolist !"
});

const item2=new Item({
  name:"Hit the + button to add a new item."
});

const item3=new Item({
  name:"<-- Hit this to delete an item."
});

const defaultItems=[item1,item2,item3];

const listSchema={
  name:String,
  items:[itemsSchema]
};

const List=mongoose.model("List",listSchema);

app.get("/", function(req, res) {

//finds if the list is empty or not,if empty it adds default items to the list and redirects or redirects directly
  Item.find({},function(err,foundItems){
    if(foundItems.length ===0){
      Item.insertMany(defaultItems,function(err){
      if(err){
        console.log(err);
      }else{
        console.log("Successfully added all tasks");
      }
      });
      res.redirect("/");
    }else{
      res.render("list", {listTitle: "Today", newListItems:foundItems });
    }
  });

});

//takes new item from input and adds it to the database
app.post("/", function(req, res){
  const itemName=req.body.newItem;
  const listName=req.body.list;

  const item=new Item({
    name:itemName
  });

  if(listName==="Today"){
    item.save();
    res.redirect("/");
  }else{
    List.findOne({name:listName},function(err,foundList){
      foundList.items.push(item);
      foundList.save();
      res.redirect("/"+listName);
    });
  }
});

app.post("/delete",function(req,res){
  const checkedItemId=req.body.checkbox;
  const listName=req.body.listName;

  if(listName==="Today"){
    Item.findByIdAndRemove(checkedItemId,function(err){
      if(err){
        console.log(err);
      }else{
        console.log("Successfully deleted the item");
        res.redirect("/");
      }
    });
  }else{
    List.findOneAndUpdate(
      {name:listName},
      {
        $pull:{items:{_id:checkedItemId}}
      },
      function(err,foundList){
        if(!err){
          res.redirect("/"+listName);
        }
      }
    );
  }

});

app.get("/:customListName",function(req,res){
  const customListName=_.capitalize(req.params.customListName);

  List.findOne({name:customListName},function(err,foundList){
    if(err){
      console.log(err);
    }else{
      if(foundList){
        //show an existing list
        res.render("list",{listTitle: foundList.name, newListItems:foundList.items });
      }else{
        //Create a new list
        const list=new List({
          name:customListName,
          items:defaultItems
        });
        list.save();
        res.redirect("/"+customListName);
      }
    }
  });

});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});