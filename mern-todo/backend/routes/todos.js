const router=require("express").Router();
let Todo=require("../models/task.model");

router.route("/").get((req,res)=>{
    Todo.find()
        .then(todos=>res.json(todos))
        .catch(err=>res.status(400).json("Error: "+err));
});

router.route("/add").post((req,res)=>{
    const todo=req.body.todo;
    const newTodo=new Todo({todo});

    newTodo.save()
        .then(()=>res.json("Todo Saved"))
        .catch(err=>res.status(400).json("Error: "+err));
});

router.route("/:id").get((req,res)=>{
    Todo.findById(req.params.id)
        .then(todo=>res.json(todo))
        .catch(err=>res.status(400).json("Error: "+err));
});

router.route("/:id").delete((req,res)=>{
    Todo.findByIdAndDelete(req.params.id)
        .then(()=>res.json("User Delete"))
        .catch(err=>res.status(400).json("Error: "+err));
});

router.route("/update/:id").post((req,res)=>{
    Todo.findById(req.params.id)
        .then(todo=>{
            todo.todo=req.body.todo;

            todo.save()
                .then(()=>res.json("Todo Updated"))
                .catch(err=>res.status(400).json("Error: "+err));
        })
        .catch(err=>res.status(400).json("Error: "+err));
});

module.exports=router;
