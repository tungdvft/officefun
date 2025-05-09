<template>
  <div>
    <Hero />
    <Stats />
    <Feature />
    <NumerologyBasics />
  
    <CoreNumbers />
    <Testimonials />
    <FAQ />
    <Blog />
  </div>
</template>

<script>
import Hero from '~/components/Hero.vue'
import WhyChooseUs from '~/components/WhyChooseUs.vue'
import Stats from '~/components/Stats.vue'
import NumerologyBasics from '~/components/NumerologyBasics.vue'
import CoreNumbers from '~/components/CoreNumbers.vue'
import Calculator from '~/components/Calculator.vue'
import Testimonials from '~/components/Testimonials.vue'
import FAQ from '~/components/FAQ.vue'
import Blog from '~/components/Blog.vue'
export default {
  components: {
    Hero,
    WhyChooseUs,
    NumerologyBasics,
    CoreNumbers,
    Calculator,
    Testimonials,
    FAQ,
    Blog,
    Stats
  }
}
</script>