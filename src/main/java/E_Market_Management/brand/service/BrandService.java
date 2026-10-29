package E_Market_Management.brand.service;

import java.lang.module.ResolutionException;
import java.util.List;

import org.springframework.stereotype.Service;

import E_Market_Management.brand.dto.BrandRequest;
import E_Market_Management.brand.dto.BrandResponse;
import E_Market_Management.brand.entity.Brand;
import E_Market_Management.brand.mapper.BrandMapper;
import E_Market_Management.brand.repository.BrandRepository;
import E_Market_Management.shared.exception.ConflictException;
import E_Market_Management.shared.exception.ResourceNotFoundException;

@Service 
public class BrandService {
    private final BrandRepository brandRepository;
    private final BrandMapper brandMapper;

    public BrandService(BrandRepository brandRepository, BrandMapper brandMapper) {
        this.brandRepository = brandRepository;
        this.brandMapper = brandMapper;
    }

    public BrandResponse createBrand(BrandRequest request) {
        if(brandRepository.findByName(request.getName()).isPresent()) {
            throw new ConflictException("Đã tồn tại thương hiệu này");
        }

        Brand brand = Brand.builder()
            .name(request.getName())
            .country(request.getCountry())
            .build();

        return brandMapper.toResponse(brandRepository.save(brand));
    }

    public List<BrandResponse> getAllBrand() {
        List<Brand> brands = brandRepository.findAll();
        if(brands.isEmpty()) throw new ResolutionException("Không tìm thấy thương hiệu nào!");

        List<BrandResponse> responses = brands.stream()
            .map(brand -> brandMapper.toResponse(brand))
            .toList();
        return responses;
    }

    public BrandResponse getBrand(Long brandId) {
        Brand brand = brandRepository.findById(brandId)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm tháy thương hiệu!"));

        return brandMapper.toResponse(brand);
    }

    public BrandResponse updateBrand(Long brandId, BrandRequest request) {
        Brand brand = brandRepository.findById(brandId)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy thương hiệu"));
        
        brand.setName(request.getName());
        brand.setCountry(request.getCountry());
        brand.setLogo(request.getLogo());

        return brandMapper.toResponse(brand);
    }

    public void deleteBrand(Long brandId) {
        Brand brand = brandRepository.findById(brandId)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy thương hiệu"));
        
        brandRepository.delete(brand);
    }
}
