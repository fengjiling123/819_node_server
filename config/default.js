'use strict';

module.exports = {
	port: parseInt(process.env.PORT, 10) || 3002,
	url: 'mongodb://localhost:27017/server819',
	session: {
		name: '819SID',
		secret: '819SID',
		cookie: {
			httpOnly: true,
			secure: false,
			maxAge: 365 * 24 * 60 * 60 * 1000,
		}
	}
}