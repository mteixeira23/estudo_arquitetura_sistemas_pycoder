class CloudflareClientIPMiddleware:
    """
    Middleware corporativo SCSI / Cloudflare:
    Normaliza request.META['REMOTE_ADDR'] com base no cabeçalho confiável 'HTTP_CF_CONNECTING_IP',
    garantindo que logs de auditoria clínica (LGPD/CFM), rate limiting no Redis e throttles do DRF
    identifiquem o IP real do cliente/profissional em vez dos IPs de borda Anycast da Cloudflare.
    """
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        cf_ip = request.META.get('HTTP_CF_CONNECTING_IP')
        if cf_ip:
            request.META['REMOTE_ADDR'] = cf_ip.strip()
        return self.get_response(request)
