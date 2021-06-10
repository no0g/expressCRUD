const express = require('express');
const router = express.Router();
const studentValidatorSchema = require('./validator')



router.get('/', (req, res, next) => {
    // try to connect to db and retrieve shits
    req.getConnection((err,con) =>{
        if(err) return next(err)

        con.query('SELECT * FROM students', (err, rows) =>{
            if(err) return   res.json({error: [{ message: "DB Cant connect, try changing table"}]})

            res.json(rows)
        })
    })
});

router.post('/new' ,(req, res, next) => {

    //validate with validator
    const validation = studentValidatorSchema.validate(req.body)
    if(validation.error) return res.send(validation.error.details[0].message)

    //check duplication
    req.getConnection((err,con)=>{
        if(err) return next(err)

        const param = [validation.value.name, validation.value.tpnumber]
        con.query("SELECT * FROM students WHERE name = ? or tpnumber = ? ",param, (err, rows)=>{
            if(err) return res.json(err);

            if(rows.length > 0) return  res.json({error: {message:"duplicate"}});

            req.getConnection((err,con)=>{
                if(err) return next(err)
                con.query("INSERT INTO students SET ? ", validation.value, (err,result)=> {
                    if(err) return  res.json({error:{message:"failed to save data"}});
                    res.json({success: {message: "success"}})
                })
        
            })
            
        })

    })
    



});

router.get('/show/:id', (req, res, next) => {
    const userid = req.params.id 
    if(!userid) return  res.json({message:"Specify ID"});

    req.getConnection((err,con)=>{
        if(err) return next(err)
        con.query("SELECT * FROM students WHERE id = ?",userid,(err,rows)=>{
            if(err) return  res.json({error: {message: "Error"}});

            if(rows.length === 0) return  res.json({error: {message: "Not Exist"}});
            
             res.json(rows);
        })
    })
});

router.put('/edit/:id', (req, res, next) => {
    // get id
    const userid = req.params.id
    if(!userid) return  res.json({error: {message: "Specify ID"}});

    // sanitize input
    //validate with validator
    const validation = studentValidatorSchema.validate(req.body)
    if(validation.error) return res.send(validation.error.details[0].message)

    //check duplication
    req.getConnection((err,con)=>{
        if(err) return next(err)

        const param = [validation.value.name, validation.value.tpnumber]
        con.query("SELECT * FROM students WHERE name = ? or tpnumber = ? ",param, (err, rows)=>{
            if(err) return res.json(err);

            if(rows.length > 1) return  res.json({error: {message:"duplicate"}});

            //edit
            req.getConnection((err, con)=>{
                if(err) return next(err)
                con.query("UPDATE students SET ? WHERE id ="+userid, validation.value, (err, result)=>{
                    if(err) return  res.json({error: {message: "Error"}});

                    res.json({success: {message: "success"}})
                } )
            })
        })

    })


});

router.delete('/delete/:id', (req, res, next) => {
    const userid = req.params.id
    if(!userid) return res.json({error: {message: "Specify ID"}});


    req.getConnection((err, con)=> {
        if(err) return next(err)
        
        con.query("DELETE FROM students WHERE id ="+userid, (err,result)=>{
            if(err) return res.json({error: {message: "Error"}});

            res.json({success: {message: "success"}})

        })
    })
});
module.exports = router