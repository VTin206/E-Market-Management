package E_Market_Management.brand.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.lang.module.ResolutionException;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import E_Market_Management.brand.dto.BrandRequest;
import E_Market_Management.brand.dto.BrandResponse;
import E_Market_Management.brand.entity.Brand;
import E_Market_Management.brand.mapper.BrandMapper;
import E_Market_Management.brand.repository.BrandRepository;
import E_Market_Management.shared.exception.ConflictException;
import E_Market_Management.shared.exception.ResourceNotFoundException;

@ExtendWith(MockitoExtension.class)
class BrandServiceTest {

    @Mock
    private BrandRepository brandRepository;

    @Mock
    private BrandMapper brandMapper;

    @InjectMocks
    private BrandService brandService;

    @Test
    void createBrand_whenNameIsAvailable_savesAndMapsBrand() {
        BrandRequest request = request("Apple", "USA", "apple.png");
        Brand saved = Brand.builder().id(1L).name("Apple").country("USA").logo("apple.png").build();
        BrandResponse expected = BrandResponse.builder().id(1L).name("Apple").build();

        when(brandRepository.findByName("Apple")).thenReturn(Optional.empty());
        when(brandRepository.save(any(Brand.class))).thenReturn(saved);
        when(brandMapper.toResponse(saved)).thenReturn(expected);

        BrandResponse actual = brandService.createBrand(request);

        assertEquals(expected, actual);
        verify(brandRepository).save(any(Brand.class));
        verify(brandMapper).toResponse(saved);
    }

    @Test
    void createBrand_whenNameAlreadyExists_throwsConflictWithoutSaving() {
        when(brandRepository.findByName("Apple"))
            .thenReturn(Optional.of(Brand.builder().id(1L).name("Apple").build()));

        assertThrows(ConflictException.class, () -> brandService.createBrand(request("Apple", "USA", "apple.png")));

        verify(brandRepository, never()).save(any(Brand.class));
    }

    @Test
    void getAllBrand_whenNoBrandsExist_throwsResolutionException() {
        when(brandRepository.findAll()).thenReturn(List.of());

        assertThrows(ResolutionException.class, () -> brandService.getAllBrand());
    }

    @Test
    void updateBrand_whenBrandExists_updatesFieldsAndSaves() {
        Brand brand = Brand.builder().id(1L).name("Old").country("USA").logo("old.png").build();
        BrandRequest request = request("New", "Vietnam", "new.png");
        BrandResponse expected = BrandResponse.builder().id(1L).name("New").country("Vietnam").logo("new.png").build();

        when(brandRepository.findById(1L)).thenReturn(Optional.of(brand));
        when(brandRepository.save(brand)).thenReturn(brand);
        when(brandMapper.toResponse(brand)).thenReturn(expected);

        BrandResponse actual = brandService.updateBrand(1L, request);

        assertEquals("New", brand.getName());
        assertEquals("Vietnam", brand.getCountry());
        assertEquals("new.png", brand.getLogo());
        assertEquals(expected, actual);
        verify(brandRepository).save(brand);
    }

    @Test
    void deleteBrand_whenBrandDoesNotExist_throwsNotFound() {
        when(brandRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> brandService.deleteBrand(99L));

        verify(brandRepository, never()).delete(any(Brand.class));
    }

    private BrandRequest request(String name, String country, String logo) {
        BrandRequest request = new BrandRequest();
        request.setName(name);
        request.setCountry(country);
        request.setLogo(logo);
        return request;
    }
}
