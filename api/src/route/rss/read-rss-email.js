const express = require('express')
const app = express()
const router = express.Router()
const {
    encode,
    decode
} = require('js-base64');
let pool = require('@/modules/pool')
router.get('/rss/:email', async (req, res) => {
    const email = req.params.email;
    const key = req.query.key;
    const sql = `SELECT ${key?key.join(','):'*'} FROM rss WHERE email='${encode(email)}';`;
    const [data] = await pool.query(sql);
    data.map(item => {
        item.email = decode(item.email)
        return item;
    });
    res.json({
        success: !!data.length,
        message: `查询用户订阅状态`,
        data: data
    })
})
module.exports = router;