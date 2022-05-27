const db = require("../models");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require("../configs/auth.config");
const Enseignant = db.enseignant;
const Etudiant = db.etudiant;

exports.loginTeacher = (req, res) => {
    let getUser;
    Enseignant
        .findOne({
            where: {email: req.body?.email},
            include: ["faculte"],
        })
        .then((ensUser) =>{
            if(!ensUser)
            {
                return res.status(401).json({
                    message: 'Authentication failed',
                    hasSearched: true
                  });
            }
        
            getUser = ensUser;
            let response =  bcrypt.compareSync(req.body.password, getUser?.password);
            
            if(!response)
            {
                return res.status(401).json({
                    message: 'Authentication failed',
                    hasSearched: true
                });
            }
            else
            {
                let token = jwt.sign({ id: getUser.id }, config.secret, {
                    expiresIn: config.expiresIn // 24 hours
                  });
    
                return res.status(200).json({
                accessToken: token,
                expiresIn: config.expiresIn,
                user: getUser,
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
              message: err.message || 'Unable to query !',
            })
          });
    
}

exports.loginStudent = (req, res) => {
    let getUser;
    Etudiant
        .findOne({
            where: {matricule: req.body?.matricule},
            include: ["classe"],
        })
        .then((ensUser) =>{
            if(!ensUser)
            {
                return res.status(401).json({
                    message: 'Authentication failed',
                    hasSearched: true
                  });
            }
        
            getUser = ensUser;
            let response =  bcrypt.compareSync(req.body.password, getUser?.password);
            
            if(!response)
            {
                return res.status(401).json({
                    message: 'Authentication failed',
                    hasSearched: true
                });
            }
            else
            {
                let token = jwt.sign({ id: getUser.id }, config.secret, {
                    expiresIn: config.expiresIn // 24 hours
                  });
    
                return res.status(200).json({
                accessToken: token,
                expiresIn: config.expiresIn,
                user: getUser,
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
              message: err.message || 'Unable to query !',
            })
          });
    
}
