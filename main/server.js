const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcrypt');

const app = express();
const port = 3000;
const bodyParser = require('body-parser'); 
app.use(bodyParser.json()); // استخدام body-parser كوسيط لتحليل جسم الطلب بتنسيق JSON
app.use(bodyParser.urlencoded({ extended: true })); // استخدام body-parser كوسيط لتحليل جسم الطلب بتنسيق url-encoded

// اتصال قاعدة البيانات
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'rating'
});

db.connect((err) => {
  if (err) {
    console.error(' DATABASE NOT CONCCTED !!!!!!!!!!! ' + err.stack);
    return;
  }
  console.log('database IS CONNECTED ^_^ ');
});
// نقطة النهاية لاستقبال بيانات الجدول filmsinfo
app.post('/api/filmsinfo', (req, res) => {
  console.log('>>>>>>>>>>>>>>>>>>>>>>.');
    const { name, descttt, count_rating } = req.body;
    
  
    const sqlQuery = 'INSERT INTO filmsinfo (name, descttt, count_rating) VALUES (?, ?, ?)';
    db.query(sqlQuery, [name, descttt, count_rating], (err, result) => {
      if (err) {
        console.error('حدث خطأ أثناء إضافة البيانات: ' + err.stack);
        return res.status(500).json({ error: 'حدث خطأ أثناء إضافة البيانات.' });
      }
      res.json({ success: true, message: 'تمت إضافة البيانات بنجاح.' });
    });
  });
// نقطة النهاية لاسترجاع بيانات الجدول filmsinfo
app.get('/api/filmsinfo/show', (req, res) => {
    const sqlQuery = 'SELECT * FROM filmsinfo';
  
    db.query(sqlQuery, (err, result) => {
      if (err) {
        console.error('حدث خطأ أثناء استعلام قاعدة البيانات: ' + err.stack);
        return res.status(500).json({ error: 'حدث خطأ أثناء الاستعلام عن قاعدة البيانات.' });
      }
      res.json(result);
    });
  });
  app.listen(port, () => {
    console.log(`الخادم يعمل على المنفذ ${port}`);
  });
  app.post('/login', (req, res) => {

    const { username, password } = req.body;
  
    // استعلام لاسترداد معلومات المستخدم المتطابقة مع اسم المستخدم المعطى
    const query = 'SELECT * FROM users WHERE username = ?';
    db.query(query, [username], (err, results) => {
  
      if (err) {
        res.status(500).json({ message: 'حدث خطأ في الخادم.' });
      } else {
        // التحقق مما إذا كان اسم المستخدم موجودًا في قاعدة البيانات
        if (results.length === 0) {
          res.status(401).json({ message: 'اسم المستخدم غير صحيح.' });
        } else {
          // المستخدم موجود، نقارن كلمة المرور المدخلة مع كلمة المرور المخزنة باستخدام bcrypt
          if (results[0].password == password) {
            // res.status(200).json({ message: "تم تسجيل الدخول" });
            res.redirect('/api/filmsinfo/show');
            
          } else {
            res.status(401).json({ message: 'كلمة المرور غير صحيحة.' });
          }
        
            
        
      
        }
      }
    });
  });