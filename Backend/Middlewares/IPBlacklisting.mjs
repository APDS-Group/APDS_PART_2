import pkg from 'express-ipfilter';
const { IpFilter, IpDeniedError } = pkg;

// Define a list of blacklisted IPs
const blacklistedIps = ['123.456.789.000', '111.222.333.444'];

// Create the IP filter middleware
const ipFilter = IpFilter(blacklistedIps, { mode: 'deny' });

// Error handling for IP filter
const handleIpFilterErrors = (err, req, res, next) => {
    if (err instanceof IpDeniedError) {
        res.status(403).json({ message: "Forbidden: Your IP is blacklisted", success: false });
    } else {
        next(err);
    }
};

export { ipFilter, handleIpFilterErrors };