import { Router } from 'express'
import passport from 'passport';

const router = Router()

router.post('/register', passport.authenticate('register', {
    failureRedirect: '/failRegister'
}), async(req, res) => {
    res.redirect('/login')
})

router.post('/login', passport.authenticate('login', {
    failureRedirect: '/failLogin'
}), async (req, res) => {
    res.redirect('/products')
})

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if(err) {
            console.log(err);
            res.redirect('/userError')
        } else res.redirect('/login')
    })
})

router.get('/github', passport.authenticate('github', { scope: ['user:email']}),
async(req, res) => {})

router.get('/api/session/githubcallback', passport.authenticate('github', {
    failureRedirect: '/login'
}), async(req, res) => {
    req.session.user = req.user
    res.redirect('/products')
})

export default router