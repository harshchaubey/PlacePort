package com.placement.portal;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
@Configuration
public class CloudinaryConfig {

    @Value("${CLOUDINARY_NAME:dgt7c8vdu}")
    private String cloudName;

    @Value("${CLOUDINARY_API_KEY:519656988714377}")
    private String apiKey;

    @Value("${CLOUDINARY_API_SECRET:DbOWvijdjMPR9ftF78kUdZjBn08}")
    private String apiSecret;

    @Bean
    public Cloudinary cloudinary() {
        return new Cloudinary(ObjectUtils.asMap(
                "cloud_name", cloudName,
                "api_key", apiKey,
                "api_secret", apiSecret,
                "secure", true));
    }
}
